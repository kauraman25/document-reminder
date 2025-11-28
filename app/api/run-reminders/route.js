// app/api/run-reminders/route.js

import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Document from '@/models/Document'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'  // so it always runs fresh

// Days left calculator (same as earlier)
function calculateDaysLeft(expiryDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)

  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Nodemailer transporter (Vercel me env vars se)
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

async function sendEmail(to, subject, text) {
  if (!to || !to.length) return

  const transporter = createTransporter()

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: Array.isArray(to) ? to.join(',') : to,
    subject,
    text,
  })
}

export async function GET() {
  try {
    await connectToDatabase()

    const docs = await Document.find({
      expiryDate: { $exists: true },
    })

    const today = new Date().toISOString().slice(0, 10)
    console.log(`Running reminders for ${today}. Total docs: ${docs.length}`)

    let sent = {
      reminder1: 0,
      reminder2: 0,
      reminder3: 0,
    }

    for (const doc of docs) {
      const daysLeft = calculateDaysLeft(doc.expiryDate)

      const baseText = `
Document: ${doc.name}
Number: ${doc.number}
Category: ${doc.category}
Expiry Date: ${new Date(doc.expiryDate).toDateString()}

There are ${daysLeft} day(s) left until expiry.

-- This is an automated reminder from Document Reminder app.
      `.trim()

      // Reminder 1
      if (
        doc.reminder1Days &&
        Number(doc.reminder1Days) === daysLeft &&
        Array.isArray(doc.reminder1Emails) &&
        doc.reminder1Emails.length > 0
      ) {
        await sendEmail(
          doc.reminder1Emails,
          `Reminder: ${doc.name} expires in ${daysLeft} day(s)`,
          baseText
        )
        sent.reminder1++
      }

      // Reminder 2
      if (
        doc.reminder2Days &&
        Number(doc.reminder2Days) === daysLeft &&
        Array.isArray(doc.reminder2Emails) &&
        doc.reminder2Emails.length > 0
      ) {
        await sendEmail(
          doc.reminder2Emails,
          `Reminder: ${doc.name} expires in ${daysLeft} day(s)`,
          baseText
        )
        sent.reminder2++
      }

      // Reminder 3
      if (
        doc.reminder3Days &&
        Number(doc.reminder3Days) === daysLeft &&
        Array.isArray(doc.reminder3Emails) &&
        doc.reminder3Emails.length > 0
      ) {
        await sendEmail(
          doc.reminder3Emails,
          `Reminder: ${doc.name} expires in ${daysLeft} day(s)`,
          baseText
        )
        sent.reminder3++
      }
    }

    return NextResponse.json(
      {
        ok: true,
        date: today,
        totalDocs: docs.length,
        sent,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error in reminder job:', err)
    return NextResponse.json(
      { ok: false, error: 'Error running reminders' },
      { status: 500 }
    )
  }
}
