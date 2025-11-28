import mongoose, { Schema } from 'mongoose'

const DocumentTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.DocumentType ||
  mongoose.model('DocumentType', DocumentTypeSchema)
