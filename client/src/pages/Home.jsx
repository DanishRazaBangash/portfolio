import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Timeline from '@/components/sections/Timeline'
import GitHubStats from '@/components/sections/GitHubStats'
import Contact from '@/components/sections/Contact'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SEOMeta from '@/components/shared/SEOMeta'

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    const hash = location.state?.scrollTo
    if (!hash) return
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.state])

  return (
    <>
      <SEOMeta path="/" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <GitHubStats />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
