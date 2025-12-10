// models/Document.js
import mongoose, { Schema } from 'mongoose'

const DocumentSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },      // e.g. "Passport"
    type: { type: String, required: true },      // e.g. "Identity"
    number: { type: String, required: true },    // e.g. "P123456789"
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    category: { type: String, required: true },  // e.g. "Personal"
    reminder1Days: { type: Number },
    reminder1Emails: [{ type: String }],   
    reminder2Days: { type: Number },
    reminder2Emails: [{ type: String }],   
    reminder3Days: { type: Number },
    reminder3Emails: [{ type: String }],

    notes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Document ||
  mongoose.model('Document', DocumentSchema)