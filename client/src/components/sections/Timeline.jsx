import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const items = [
  {
    year: '2026',
    type: 'achievement',
    title: '98th Percentile — HEC NSCT',
    subtitle: 'National Skill Competency Test, Pakistan',
    desc: 'Ranked in the top 2% nationally across all CS graduates in the Higher Education Commission competency assessment.',
  },
  {
    year: '2025–26',
    type: 'project',
    title: 'BotForge — Final Year Project',
    subtitle: 'University of Peshawar · Supervised by Dr. Sara Shehzad',
    desc: 'Designed and shipped a production-grade no-code AI chatbot platform with a custom four-tier parallel RAG pipeline, full analytics, subscription model, and embeddable widget system.',
  },
  {
    year: '2025',
    type: 'cert',
    title: 'Full Stack Web Development',
    subtitle: 'Angela Yu / Udemy',
    desc: 'Comprehensive MERN stack certification covering React, Node.js, Express, MongoDB, REST APIs, and deployment.',
  },
  {
    year: '2025',
    type: 'cert',
    title: 'Google Agile Essentials + Intro to AI',
    subtitle: 'Coursera / Google',
    desc: "Completed both Agile project management and AI fundamentals certifications through Google's official Coursera tracks.",
  },
  {
    year: '2022',
    type: 'edu',
    title: 'BS Computer Science — Enrolled',
    subtitle: 'University of Peshawar',
    desc: 'Began undergraduate degree in CS, consistently maintaining a 3.9 GPA across all semesters.',
  },
  {
    year: '2023',
    type: 'cert',
    title: 'Google Frontend Development Bootcamp',
    subtitle: 'Google',
    desc: 'Foundational frontend engineering program covering HTML, CSS, JavaScript, and modern UI patterns.',
  },
]

const typeColors = {
  achievement: 'bg-white text-black',
  project:     'bg-white/15 text-white/90',
  cert:        'bg-white/08 text-white/60',
  edu:         'bg-white/08 text-white/60',
}

const typeLabels = {
  achievement: 'Achievement',
  project:     'Project',
  cert:        'Certification',
  edu:         'Education',
}

export default function Timeline() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-14"
        >
          <p className="text-xs tracking-widest uppercase text-white/30 mb-3">Journey</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient">Experience & Education</h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-4 top-0 bottom-0 w-px bg-white/08"
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.2 }}
          />

          <div className="space-y-8 pl-12">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.09 }}
                className="relative"
              >
                {/* Dot */}
                <div className="absolute -left-[2.05rem] top-1.5 w-2.5 h-2.5 rounded-full bg-white/30 border-2 border-bg ring-4 ring-white/04" />

                <div className="glass glass-hover rounded-2xl p-5 transition-all duration-200">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-white/25 text-xs mb-1 block">{item.year}</span>
                      <h3 className="text-white text-sm font-semibold">{item.title}</h3>
                      <p className="text-white/45 text-xs mt-0.5">{item.subtitle}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${typeColors[item.type]}`}>
                      {typeLabels[item.type]}
                    </span>
                  </div>
                  <p className="text-white/55 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
