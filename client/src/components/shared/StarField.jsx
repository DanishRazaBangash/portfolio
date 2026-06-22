import { useEffect, useRef } from 'react'
import { useTheme } from '@/store/useTheme'

export default function StarField() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (theme !== 'dark') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let stars = []
    let shooters = []
    let frame = 0
    let nextShoot = 220 + Math.floor(Math.random() * 180)

    const buildStars = () => {
      const n = Math.min(240, Math.floor((canvas.width * canvas.height) / 5200))
      stars = Array.from({ length: n }, () => ({
        x:     Math.random(),
        y:     Math.random(),
        r:     Math.random() * 1.0 + 0.18,
        base:  Math.random() * 0.38 + 0.06,
        phase: Math.random() * Math.PI * 2,
        rate:  Math.random() * 0.0045 + 0.0012,
      }))
    }

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      buildStars()
    }
    resize()
    window.addEventListener('resize', resize)

    const spawnShooter = () => {
      /* Slight downward-right angle, varied */
      const ang = Math.PI / 4 + (Math.random() - 0.5) * 0.65
      const spd = 5 + Math.random() * 4.5
      shooters.push({
        x:    Math.random() * canvas.width  * 0.60,
        y:    Math.random() * canvas.height * 0.50,
        vx:   Math.cos(ang) * spd,
        vy:   Math.sin(ang) * spd,
        tail: 110 + Math.random() * 110,
        life: 0,
        max:  48 + Math.floor(Math.random() * 28),
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      /* ── twinkling stars ── */
      const W = canvas.width, H = canvas.height
      for (const s of stars) {
        const op = s.base * (0.52 + 0.48 * Math.sin(s.phase + frame * s.rate))
        ctx.beginPath()
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${op.toFixed(3)})`
        ctx.fill()
      }

      /* ── spawn shooting star ── */
      if (frame >= nextShoot) {
        spawnShooter()
        /* next one in ~3.5 – 8 s at 60 fps */
        nextShoot = frame + 210 + Math.floor(Math.random() * 290)
      }

      /* ── draw & advance shooting stars ── */
      shooters = shooters.filter(s => s.life < s.max)
      for (const s of shooters) {
        const p = s.life / s.max
        /* smooth bell: fade in over first 20%, fade out over rest */
        const alpha = p < 0.20 ? p / 0.20 : 1 - (p - 0.20) / 0.80

        const mag = Math.hypot(s.vx, s.vy)
        const nx = s.vx / mag, ny = s.vy / mag
        const hx = s.x + s.vx * s.life
        const hy = s.y + s.vy * s.life
        const tx = hx - nx * s.tail
        const ty = hy - ny * s.tail

        /* gradient tail: transparent → bright head */
        const grad = ctx.createLinearGradient(tx, ty, hx, hy)
        grad.addColorStop(0,    'rgba(255,255,255,0)')
        grad.addColorStop(0.55, `rgba(255,255,255,${(alpha * 0.28).toFixed(3)})`)
        grad.addColorStop(1,    `rgba(255,255,255,${(alpha * 0.75).toFixed(3)})`)

        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(hx, hy)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.4
        ctx.stroke()

        /* small bright dot at the head */
        ctx.beginPath()
        ctx.arc(hx, hy, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.88).toFixed(3)})`
        ctx.fill()

        s.life++
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  if (theme !== 'dark') return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  )
}
