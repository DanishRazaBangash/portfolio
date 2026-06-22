import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ringEl = ringRef.current
    if (!dot || !ringEl) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
    }

    const onEnterLink = () => {
      dot.style.opacity = '0'
      ringEl.style.width = '48px'
      ringEl.style.height = '48px'
      ringEl.style.borderColor = 'rgba(255,255,255,0.5)'
    }
    const onLeaveLink = () => {
      dot.style.opacity = '1'
      ringEl.style.width = '32px'
      ringEl.style.height = '32px'
      ringEl.style.borderColor = 'rgba(255,255,255,0.25)'
    }

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      ringEl.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`
      raf.current = requestAnimationFrame(animate)
    }

    raf.current = requestAnimationFrame(animate)
    window.addEventListener('mousemove', onMove)

    const links = document.querySelectorAll('a, button, [role="button"]')
    links.forEach((l) => {
      l.addEventListener('mouseenter', onEnterLink)
      l.addEventListener('mouseleave', onLeaveLink)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transition: 'opacity 0.2s' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]"
        style={{
          border: '1px solid rgba(255,255,255,0.25)',
          width: '32px',
          height: '32px',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
        }}
      />
    </>
  )
}
