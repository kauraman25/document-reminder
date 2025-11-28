// app/api/document-types/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import DocumentType from '@/models/DocumentType'
import { DEFAULT_TYPES } from '@/lib/document-types'  // same file where you kept default list

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectToDatabase()

    let types = await DocumentType.find({ isActive: true }).sort({ name: 1 })

    if (types.length === 0 && DEFAULT_TYPES?.length) {
      const docs = await DocumentType.insertMany(
        DEFAULT_TYPES.map(name => ({ name }))
      )
      types = docs
    }

    const normalized = types.map(t => ({
      id: t._id.toString(),
      name: t.name,
    }))

    return NextResponse.json(normalized, { status: 200 })
  } catch (error) {
    console.error('Error fetching document types:', error)
    return NextResponse.json(
      { message: 'Error fetching document types' },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    await connectToDatabase()
    const { name } = await req.json()

    const trimmed = (name || '').trim()
    if (!trimmed) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      )
    }

    const existing = await DocumentType.findOne({
      name: trimmed,
    })

    if (existing) {
      return NextResponse.json(
        {
          id: existing._id.toString(),
          name: existing.name,
        },
        { status: 200 }
      )
    }

    const created = await DocumentType.create({ name: trimmed })

    return NextResponse.json(
      {
        id: created._id.toString(),
        name: created.name,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating document type:', error)
    return NextResponse.json(
      { message: 'Error creating document type' },
      { status: 500 }
    )
  }
}
