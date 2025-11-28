import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Document from '@/models/Document'

export const dynamic = 'force-dynamic'

function parseEmails(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  return String(value)
    .split(',')
    .map(e => e.trim())
    .filter(Boolean)
}

export async function GET() {
  try {
    await connectToDatabase()
    const docs = await Document.find().sort({ createdAt: -1 })

    const normalized = docs.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      type: doc.type,
      number: doc.number,
      issueDate: doc.issueDate.toISOString().slice(0, 10),   
      expiryDate: doc.expiryDate.toISOString().slice(0, 10), 
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
    return NextResponse.json({ message: 'Error fetching documents' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, type, number, issueDate, expiryDate, category, notes,  reminder1Days,
      reminder1Emails,
      reminder2Days,
      reminder2Emails,
      reminder3Days,
      reminder3Emails, } = body

    if (!name || !type || !number || !issueDate || !expiryDate || !category) {
      return NextResponse.json(
        { message: 'name, type, number, issueDate, expiryDate, category are required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const created = await Document.create({
      name,
      type,
      number,
      issueDate,
      expiryDate,
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
      issueDate: created.issueDate.toISOString().slice(0, 10),
      expiryDate: created.expiryDate.toISOString().slice(0, 10),
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
    return NextResponse.json({ message: 'Error creating document' }, { status: 500 })
  }
}
