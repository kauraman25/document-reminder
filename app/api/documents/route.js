// app/api/documents/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Document from '@/models/Document'
import { getUserFromRequest } from '@/lib/server-auth'

export const dynamic = 'force-dynamic'

function parseEmails(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  return String(value)
    .split(',')
    .map(e => e.trim())
    .filter(Boolean)
}

function safeDateString(val) {
  if (!val) return null
  try {
    if (val instanceof Date) return val.toISOString().slice(0, 10)
    const d = new Date(val)
    if (isNaN(d.getTime())) return null
    return d.toISOString().slice(0, 10)
  } catch {
    return null
  }
}

function isValidDateLike(val) {
  if (!val) return false
  const d = new Date(val)
  return !isNaN(d.getTime())
}

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()
    const docs = await Document.find({ owner: user._id }).sort({ createdAt: -1 })

    const normalized = docs.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      type: doc.type,
      number: doc.number,
      issueDate: safeDateString(doc.issueDate),
      expiryDate: safeDateString(doc.expiryDate),
      category: doc.category,
      notes: doc.notes || '',
      reminder1Days: doc.reminder1Days ?? '',
      reminder1Emails: doc.reminder1Emails || [],
      reminder2Days: doc.reminder2Days ?? '',
      reminder2Emails: doc.reminder2Emails || [],
      reminder3Days: doc.reminder3Days ?? '',
      reminder3Emails: doc.reminder3Emails || [],
    }))

    return NextResponse.json(normalized, { status: 200 })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ message: 'Error fetching documents', details: String(error.message) }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      name,
      type,
      number,
      issueDate,
      expiryDate,
      category,
      notes,
      reminder1Days,
      reminder1Emails,
      reminder2Days,
      reminder2Emails,
      reminder3Days,
      reminder3Emails,
    } = body

    if (!name || !type || !number || !issueDate || !expiryDate || !category) {
      return NextResponse.json(
        { message: 'name, type, number, issueDate, expiryDate, category are required' },
        { status: 400 }
      )
    }

    // validate dates
    if (!isValidDateLike(issueDate) || !isValidDateLike(expiryDate)) {
      return NextResponse.json({ message: 'Invalid issueDate or expiryDate' }, { status: 400 })
    }

    await connectToDatabase()

    const created = await Document.create({
      owner: user._id,
      name,
      type,
      number,
      issueDate: new Date(issueDate),
      expiryDate: new Date(expiryDate),
      category,
      notes,
      reminder1Days: reminder1Days || null,
      reminder1Emails: parseEmails(reminder1Emails),
      reminder2Days: reminder2Days || null,
      reminder2Emails: parseEmails(reminder2Emails),
      reminder3Days: reminder3Days || null,
      reminder3Emails: parseEmails(reminder3Emails),
    })

    const normalized = {
      id: created._id.toString(),
      name: created.name,
      type: created.type,
      number: created.number,
      issueDate: safeDateString(created.issueDate),
      expiryDate: safeDateString(created.expiryDate),
      category: created.category,
      notes: created.notes || '',
      reminder1Days: created.reminder1Days ?? '',
      reminder1Emails: created.reminder1Emails || [],
      reminder2Days: created.reminder2Days ?? '',
      reminder2Emails: created.reminder2Emails || [],
      reminder3Days: created.reminder3Days ?? '',
      reminder3Emails: created.reminder3Emails || [],
    }

    return NextResponse.json(normalized, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ message: 'Error creating document', details: String(error.message) }, { status: 500 })
  }
}
