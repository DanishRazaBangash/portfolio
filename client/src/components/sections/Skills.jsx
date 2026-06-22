import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const categories = [
  {
    label: 'Frontend',
    skills: [
      { name: 'React.js',      level: 95 },
      { name: 'Next.js',       level: 82 },
      { name: 'TypeScript',    level: 80 },
      { name: 'Tailwind CSS',  level: 93 },
      { name: 'Framer Motion', level: 78 },
    ],
  },
  {
    label: 'Backend',
    skills: [
      { name: 'Node.js',     level: 92 },
      { name: 'Express.js',  level: 92 },
      { name: 'REST APIs',   level: 90 },
      { name: 'Socket.io',   level: 78 },
      { name: 'JWT Auth',    level: 88 },
    ],
  },
  {
    label: 'Database',
    skills: [
      { name: 'MongoDB',    level: 90 },
      { name: 'Mongoose',   level: 88 },
      { name: 'MySQL',      level: 72 },
      { name: 'PostgreSQL', level: 68 },
    ],
  },
  {
    label: 'AI / ML',
    skills: [
      { name: 'Gemini API',    level: 88 },
      { name: 'OpenAI API',    level: 82 },
      { name: 'LangChain',     level: 74 },
      { name: 'RAG Pipelines', level: 85 },
      { name: 'Vector Search', level: 80 },
    ],
  },
  {
    label: 'Tools',
    skills: [
      { name: 'Git / GitHub', level: 92 },
      { name: 'Docker',       level: 72 },
      { name: 'Postman',      level: 88 },
      { name: 'Cloudinary',   level: 80 },
    ],
  },
]

function SkillBar({ name, level, inView }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/70">{name}</span>
        <span className="text-[11px] text-white/30">{level}%</span>
      </div>
      <div className="h-1 bg-white/08 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${level}%` : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" className="py-16 md:py-28 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-xs tracking-widest uppercase text-white/30 mb-3">What I work with</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-8 sm:mb-10">Technical Skills</h2>
        </motion.div>

        {/* Category tabs — horizontal scroll on mobile so they stay on one line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex overflow-x-auto no-scrollbar gap-2 mb-8 sm:mb-10 pb-1"
        >
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActive(i)}
              className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                active === i
                  ? 'bg-white text-black font-medium'
                  : 'glass text-white/60 hover:text-white hover:bg-white/08'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Skill bars grid */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass rounded-2xl p-5 sm:p-8 grid sm:grid-cols-2 gap-x-12 gap-y-5"
        >
          {categories[active].skills.map((skill) => (
            <SkillBar key={skill.name} {...skill} inView={inView} />
          ))}
        </motion.div>

        {/* All-tech pill cloud — desktop only; duplicates what the bars already show */}
        <div className="mt-10 hidden sm:block overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="flex gap-3 flex-wrap"
          >
            {[
              'React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB',
              'Tailwind', 'Framer Motion', 'Socket.io', 'Gemini API', 'OpenAI',
              'LangChain', 'Docker', 'Cloudinary', 'JWT', 'REST APIs', 'Mongoose',
              'Git', 'Postman', 'Agile', 'Jest', 'Vector Search',
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs text-white/50 glass rounded-full border border-white/08"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
