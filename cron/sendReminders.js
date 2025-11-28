// cron/sendReminders.js

import mongoose from 'mongoose'
import { connectToDatabase } from '../lib/mongodb.js'
import Document from "../models/Document.js"
import nodemailer from 'nodemailer'

// Days left calculator
function calculateDaysLeft(expiryDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)

  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Nodemailer transporter
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

async function run() {
  try {
    await connectToDatabase()

    const docs = await Document.find({
      expiryDate: { $exists: true },
    })

    const today = new Date().toISOString().slice(0, 10)
    console.log(`Running reminders for ${today}. Total docs: ${docs.length}`)

    for (const doc of docs) {
      const daysLeft = calculateDaysLeft(doc.expiryDate)

      const baseText = `
Document: ${doc.name}
Number: ${doc.number}
Category: ${doc.category}
Expiry Date: ${new Date(doc.expiryDate).toDateString()}

There are ${daysLeft} day(s) left until expiry.

-- This is an automated reminder from Document Reminder App.
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
        console.log(
          `Sent reminder1 for "${doc.name}" to ${doc.reminder1Emails.join(', ')}`
        )
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
        console.log(
          `Sent reminder2 for "${doc.name}" to ${doc.reminder2Emails.join(', ')}`
        )
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
        console.log(
          `Sent reminder3 for "${doc.name}" to ${doc.reminder3Emails.join(', ')}`
        )
      }
    }

    await mongoose.connection.close()
    console.log('Reminder job finished.')
  } catch (err) {
    console.error('Error in reminder job:', err)
    process.exit(1)
  }
}

run()
