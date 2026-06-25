import { Router } from 'express'
import Post    from '../models/Post.js'
import Comment from '../models/Comment.js'
import { protect } from '../middleware/auth.js'

const router = Router()

/* public: list published posts */
router.get('/', async (req, res) => {
  try {
    const { status, tag } = req.query
    const isAdmin = req.headers.authorization?.startsWith('Bearer ')

    const filter = {}
    if (!isAdmin) filter.status = 'published'
    else if (status) filter.status = status
    if (tag) filter.tags = tag

    const posts = await Post.find(filter).sort({ publishedAt: -1, createdAt: -1 }).select('-body')
    res.json({ posts })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

/* public: single post + approved comments — increments view count for non-admin visitors */
router.get('/:slug', async (req, res) => {
  try {
    const isAdmin = req.headers.authorization?.startsWith('Bearer ')
    const filter  = { slug: req.params.slug, status: 'published' }

    const post = isAdmin
      ? await Post.findOne(filter)
      : await Post.findOneAndUpdate(filter, { $inc: { views: 1 } }, { new: true })

    if (!post) return res.status(404).json({ message: 'Not found' })
    const comments = await Comment.find({ postSlug: req.params.slug, approved: true }).sort({ createdAt: -1 })
    res.json({ post, comments })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

/* public: add comment */
router.post('/:slug/comments', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
    if (!post) return res.status(404).json({ message: 'Post not found' })
    const { name, email, body } = req.body
    if (!name || !email || !body) return res.status(400).json({ message: 'All fields required' })
    const comment = await Comment.create({ post: post._id, postSlug: req.params.slug, name, email, body })
    res.status(201).json({ comment })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

/* admin: create post */
router.post('/', protect, async (req, res) => {
  try {
    const post = await Post.create(req.body)
    res.status(201).json({ post })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

/* admin: update post */
router.put('/:id', protect, async (req, res) => {
  try {
    const update = req.body
    if (update.status === 'published') {
      const existing = await Post.findById(req.params.id)
      if (!existing?.publishedAt) update.publishedAt = new Date()
    }
    const words = (update.body || '').trim().split(/\s+/).length
    update.readingTime = `${Math.max(1, Math.round(words / 200))} min read`
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    if (!post) return res.status(404).json({ message: 'Not found' })
    res.json({ post })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

/* admin: delete post */
router.delete('/:id', protect, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
    await Comment.deleteMany({ post: req.params.id })
    res.json({ message: 'Deleted' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
