import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Document from '@/models/Document'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

function toClient(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    type: doc.type,
    number: doc.number,
    issueDate: doc.issueDate.toISOString().slice(0, 10),
    expiryDate: doc.expiryDate.toISOString().slice(0, 10),
    category: doc.category,
    notes: doc.notes || '',
  }
}

export async function GET(req, context) {
  try {
    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    await connectToDatabase()
    const doc = await Document.findById(id)

    if (!doc) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json(toClient(doc), { status: 200 })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json({ message: 'Error fetching document' }, { status: 500 })
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params
    const body = await req.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    await connectToDatabase()
    const updated = await Document.findByIdAndUpdate(
      id,
      {
        name: body.name,
        type: body.type,
        number: body.number,
        issueDate: body.issueDate,
        expiryDate: body.expiryDate,
        category: body.category,
        notes: body.notes,
      },
      { new: true, runValidators: true }
    )

    if (!updated) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json(toClient(updated), { status: 200 })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({ message: 'Error updating document' }, { status: 500 })
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    await connectToDatabase()
    const deleted = await Document.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ message: 'Error deleting document' }, { status: 500 })
  }
}
