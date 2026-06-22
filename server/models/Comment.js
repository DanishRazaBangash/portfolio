import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    post:     { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    postSlug: { type: String, required: true },
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    body:     { type: String, required: true, trim: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Comment', commentSchema)
