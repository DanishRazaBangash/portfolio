import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Home, BookOpen, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import SEOMeta from '@/components/shared/SEOMeta'

/* ── Floating code fragment chips ── */
const fragments = [
  { code: '// 404.js not found',        top: '18%', left:  '6%',  rotate: '-6deg',  delay: 0.6 },
  { code: 'return null',                 top: '22%', right: '7%',  rotate:  '5deg',  delay: 0.75 },
  { code: "throw new Error('Not found')", bottom: '28%', left: '5%', rotate: '-4deg', delay: 0.9 },
  { code: 'status: 404',                 bottom: '22%', right: '6%', rotate:  '6deg', delay: 1.0 },
]

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <SEOMeta title="404 — Page Not Found" description="This page doesn't exist. Let me help you find your way back." noindex />
      <Navbar />

      <main className="min-h-screen flex flex-col items-center justify-center px-6 pb-20 md:pb-32 relative overflow-hidden">

        {/* Radial glow — same pattern as hero */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 44%, var(--hero-glow) 0%, transparent 70%)' }}
        />

        {/* Floating code chips — hidden on mobile to avoid clutter */}
        {fragments.map((f) => (
          <motion.div
            key={f.code}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: f.delay }}
            className="absolute hidden md:block pointer-events-none select-none"
            style={{ top: f.top, bottom: f.bottom, left: f.left, right: f.right, transform: `rotate(${f.rotate})` }}
          >
            <div className="glass px-3 py-1.5 rounded-lg">
              <span className="font-mono text-xs text-white/25">{f.code}</span>
            </div>
          </motion.div>
        ))}

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs text-white/60 mb-6"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400" />
          </span>
          Error · Page not found
        </motion.div>

        {/* Giant 404 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <div
            className="text-[8rem] sm:text-[11rem] md:text-[14rem] font-bold leading-none tracking-tighter text-gradient select-none"
            style={{ animation: 'glitch 7s ease-in-out infinite' }}
          >
            404
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-xl sm:text-2xl font-semibold text-white mt-2 mb-3"
        >
          This page doesn't exist
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-white/40 text-sm max-w-xs text-center mb-10 leading-relaxed"
        >
          Looks like this URL wandered off into the void.
          <br />Let me help you find your way back.
        </motion.p>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
          >
            <Home size={14} />
            Go Home
          </Link>
          <Link
            to="/blog"
            className="flex items-center gap-2 px-5 py-2.5 glass glass-hover text-white text-sm font-medium rounded-xl"
          >
            <BookOpen size={14} />
            Read Blog
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 glass glass-hover text-white/60 text-sm font-medium rounded-xl"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>
        </motion.div>

      </main>
    </>
  )
}
