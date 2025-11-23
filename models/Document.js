// models/Document.js
import mongoose, { Schema } from 'mongoose'

const DocumentSchema = new Schema(
  {
    name: { type: String, required: true },      // e.g. "Passport"
    type: { type: String, required: true },      // e.g. "Identity"
    number: { type: String, required: true },    // e.g. "P123456789"
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    category: { type: String, required: true },  // e.g. "Personal"
    notes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Document ||
  mongoose.model('Document', DocumentSchema)