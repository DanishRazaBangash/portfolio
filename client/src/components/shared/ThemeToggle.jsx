import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/store/useTheme'
import { cn } from '@/lib/utils'

export default function ThemeToggle({ className }) {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        'w-9 h-9 flex items-center justify-center rounded-lg glass glass-hover transition-all duration-200',
        className
      )}
    >
      {theme === 'dark'
        ? <Sun size={16} className="text-white/70" />
        : <Moon size={16} className="text-black/70" />
      }
    </button>
  )
}
