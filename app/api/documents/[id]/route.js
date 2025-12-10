// app/api/documents/[id]/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Document from '@/models/Document'
import mongoose from 'mongoose'
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

function toClient(doc) {
  return {
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
  }
}

export async function GET(req, context) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { id } = context.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    await connectToDatabase()
    const doc = await Document.findById(id)

    if (!doc) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 })
    }
    if (!doc.owner.equals(user._id)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    return NextResponse.json(toClient(doc), { status: 200 })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json({ message: 'Error fetching document', details: String(error.message) }, { status: 500 })
  }
}

export async function PUT(req, context) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { id } = context.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    const body = await req.json()

    // Basic validation for dates if provided
    if (body.issueDate && isNaN(new Date(body.issueDate).getTime())) {
      return NextResponse.json({ message: 'Invalid issueDate' }, { status: 400 })
    }
    if (body.expiryDate && isNaN(new Date(body.expiryDate).getTime())) {
      return NextResponse.json({ message: 'Invalid expiryDate' }, { status: 400 })
    }

    await connectToDatabase()
    const doc = await Document.findById(id)
    if (!doc) return NextResponse.json({ message: 'Document not found' }, { status: 404 })
    if (!doc.owner.equals(user._id)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    // update fields
    doc.name = body.name
    doc.type = body.type
    doc.number = body.number
    doc.issueDate = body.issueDate ? new Date(body.issueDate) : doc.issueDate
    doc.expiryDate = body.expiryDate ? new Date(body.expiryDate) : doc.expiryDate
    doc.category = body.category
    doc.notes = body.notes
    doc.reminder1Days = body.reminder1Days || null
    doc.reminder1Emails = parseEmails(body.reminder1Emails)
    doc.reminder2Days = body.reminder2Days || null
    doc.reminder2Emails = parseEmails(body.reminder2Emails)
    doc.reminder3Days = body.reminder3Days || null
    doc.reminder3Emails = parseEmails(body.reminder3Emails)

    const updated = await doc.save()
    return NextResponse.json(toClient(updated), { status: 200 })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({ message: 'Error updating document', details: String(error.message) }, { status: 500 })
  }
}

export async function DELETE(req, context) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { id } = context.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    await connectToDatabase()
    const doc = await Document.findById(id)
    if (!doc) return NextResponse.json({ message: 'Document not found' }, { status: 404 })
    if (!doc.owner.equals(user._id)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    await doc.deleteOne()
    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ message: 'Error deleting document', details: String(error.message) }, { status: 500 })
  }
}
