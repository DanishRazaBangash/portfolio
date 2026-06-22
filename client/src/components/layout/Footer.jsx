import { Mail } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '@/components/shared/SocialIcons'
import { Link } from 'react-router-dom'

const socials = [
  { icon: GitHubIcon,   label: 'GitHub',   href: 'https://github.com/danishrazabangash' },
  { icon: LinkedInIcon, label: 'LinkedIn', href: 'https://linkedin.com/in/danish-raza-bangash' },
  { icon: Mail,         label: 'Email',    href: 'mailto:danishrazabangash@gmail.com' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/06 py-10 mt-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-semibold text-white text-sm">Danish Raza</span>
          <span className="text-xs text-white/30">MERN Stack Developer · Peshawar, Pakistan</span>
        </div>

        <nav className="flex items-center gap-4 text-xs text-white/40">
          <button onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">About</button>
          <button onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Projects</button>
          <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Contact</button>
        </nav>

        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              className="w-8 h-8 flex items-center justify-center glass rounded-lg hover:bg-white/10 hover:text-white text-white/50 transition-all"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6 pt-6 border-t border-white/04 flex items-center justify-between">
        <p className="text-[11px] text-white/20">© {year} Danish Raza. Built with React + Node.js.</p>
        {/* Easter egg: konami-code hint hidden in plain sight */}
        <p className="text-[11px] text-white/10 select-none" title="⬆⬆⬇⬇⬅➡⬅➡BA">
          ∴
        </p>
      </div>
    </footer>
  )
}
