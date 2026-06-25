import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt:     { type: String, trim: true },
    body:        { type: String, required: true },
    coverImage:  { type: String },
    tags:        [{ type: String, lowercase: true, trim: true }],
    status:      { type: String, enum: ['draft', 'published'], default: 'draft' },
    readingTime: { type: String },
    publishedAt: { type: Date },
    views:       { type: Number, default: 0 },
  },
  { timestamps: true }
)

postSchema.index({ title: 'text', body: 'text', tags: 'text' })

postSchema.pre('save', function (next) {
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  const words = (this.body || '').trim().split(/\s+/).length
  const mins  = Math.max(1, Math.round(words / 200))
  this.readingTime = `${mins} min read`
  next()
})

export default mongoose.model('Post', postSchema)
