import { Router } from 'express'
import Contact from '../models/Contact.js'

const router = Router()

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields required' })
  }

  try {
    await Contact.create({ name, email, subject, message })
  } catch (err) {
    console.error('[contact] DB save failed:', err)
    return res.status(500).json({ message: 'Server error' })
  }

  // Respond immediately — email is best-effort and must not block the user
  res.status(201).json({ message: 'Message received' })

  if (process.env.BREVO_API_KEY) {
    fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Portfolio Contact', email: process.env.EMAIL_FROM },
        to:     [{ email: process.env.EMAIL_TO }],
        subject: `[Portfolio] ${subject}`,
        htmlContent: `
          <div style="font-family:sans-serif;max-width:520px;padding:24px;background:#111;color:#eee;border-radius:12px">
            <h3 style="margin:0 0 12px;color:#fff">${subject}</h3>
            <p style="margin:0 0 4px"><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <hr style="border-color:#333;margin:16px 0"/>
            <p style="white-space:pre-wrap;color:#ccc">${message}</p>
          </div>
        `,
      }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.text()
          console.error('[contact] Brevo error:', r.status, body)
        }
      })
      .catch((err) => console.error('[contact] Email failed:', err.message))
  }
})

export default router
