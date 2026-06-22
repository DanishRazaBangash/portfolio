import { Router } from 'express'
import nodemailer from 'nodemailer'
import Contact from '../models/Contact.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields required' })
    }

    await Contact.create({ name, email, subject, message })

    // Send email if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to:   process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `[Portfolio] ${subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;padding:24px;background:#111;color:#eee;border-radius:12px">
            <h3 style="margin:0 0 12px;color:#fff">${subject}</h3>
            <p style="margin:0 0 4px"><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <hr style="border-color:#333;margin:16px 0"/>
            <p style="white-space:pre-wrap;color:#ccc">${message}</p>
          </div>
        `,
      })
    }

    res.status(201).json({ message: 'Message received' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
