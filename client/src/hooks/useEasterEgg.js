import { useEffect } from 'react'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export function useEasterEgg() {
  useEffect(() => {
    let idx = 0
    const handler = (e) => {
      if (e.key === KONAMI[idx]) {
        idx++
        if (idx === KONAMI.length) {
          idx = 0
          // Football easter egg
          const el = document.createElement('div')
          el.innerHTML = '⚽'
          el.style.cssText = `
            position:fixed; font-size:48px; top:50%; left:50%;
            transform:translate(-50%,-50%) scale(0);
            z-index:9999; pointer-events:none;
            transition:transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.6s;
            opacity:1;
          `
          document.body.appendChild(el)
          requestAnimationFrame(() => {
            el.style.transform = 'translate(-50%,-50%) scale(2)'
          })
          setTimeout(() => { el.style.opacity = '0' }, 1200)
          setTimeout(() => el.remove(), 1800)
        }
      } else {
        idx = e.key === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
