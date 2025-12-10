// models/User.js
import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetToken: {
      token: String,
      expiresAt: Date,
    },
  },
  { timestamps: true }
)

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash)
}

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10)
}

export default mongoose.models.User || mongoose.model('User', UserSchema)
