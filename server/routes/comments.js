import { Router } from 'express'
import Comment from '../models/Comment.js'
import { protect } from '../middleware/auth.js'

const router = Router()

/* admin: all comments */
router.get('/', protect, async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }).populate('post', 'title slug')
    res.json({ comments })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

/* admin: approve / un-approve */
router.put('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ comment })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

/* admin: delete */
router.delete('/:id', protect, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
