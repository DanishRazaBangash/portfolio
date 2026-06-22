import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { GitHubIcon } from '@/components/shared/SocialIcons'
import { useTheme } from '@/store/useTheme'

/* ── GitHub's exact contribution-level colours ── */
const LEVEL_COLORS = {
  dark:  ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
}
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

/* ── Build a 7-row × N-week grid ── */
function buildGrid(contributions) {
  const byDate = {}
  for (const c of contributions) byDate[c.date] = c

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  const rangeStart = new Date(today)
  rangeStart.setDate(today.getDate() - 364)
  const rangeStartStr = rangeStart.toISOString().slice(0, 10)

  /* rewind to the previous Sunday */
  const gridStart = new Date(rangeStart)
  gridStart.setDate(gridStart.getDate() - gridStart.getDay())

  const days = []
  const cur = new Date(gridStart)
  while (cur.toISOString().slice(0, 10) <= todayStr) {
    const iso = cur.toISOString().slice(0, 10)
    const inRange = iso >= rangeStartStr
    const c = byDate[iso]
    days.push({
      date:  iso,
      count: inRange ? (c?.count ?? 0) : 0,
      level: inRange ? (c?.level ?? 0) : -1,
    })
    cur.setDate(cur.getDate() + 1)
  }

  /* pad last partial week with invisible cells */
  while (days.length % 7 !== 0) days.push({ date: '', count: 0, level: -1 })

  const weeks = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
  return weeks
}

/* ── Compute month-label positions ── */
function getMonthLabels(weeks) {
  const labels = []
  let prevMonth = -1
  weeks.forEach((week, wi) => {
    for (const d of week) {
      if (!d.date || d.level < 0) continue
      const m = new Date(d.date).getMonth()
      if (m !== prevMonth) { labels.push({ wi, m }); prevMonth = m }
      break
    }
  })
  return labels
}

/* ── Streak & total helpers ── */
function computeStats(contributions) {
  if (!contributions.length) return { yearTotal: 0, longest: 0, current: 0 }
  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date))

  let yearTotal = 0, longest = 0, streak = 0
  for (const c of sorted) {
    yearTotal += c.count
    streak = c.count > 0 ? streak + 1 : 0
    longest = Math.max(longest, streak)
  }

  /* current streak — walk backwards; skip today if still 0 */
  const rev = [...sorted].reverse()
  let current = 0, i = rev[0]?.count === 0 ? 1 : 0
  while (i < rev.length && rev[i].count > 0) { current++; i++ }

  return { yearTotal, longest, current }
}

/* ── Helpers ── */
function fmtDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

const CELL = 13, GAP = 3, STEP = CELL + GAP

/* ════════════════════════════════════════════════════════ */
export default function GitHubStats() {
  const { theme } = useTheme()
  const [contributions, setContributions] = useState([])
  const [profile, setProfile]             = useState(null)
  const [loading, setLoading]             = useState(true)
  const [tooltip, setTooltip]             = useState(null)
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  const isDark      = theme === 'dark'
  const colors      = isDark ? LEVEL_COLORS.dark  : LEVEL_COLORS.light
  const labelColor  = isDark ? '#8b949e' : '#57606a'
  const tooltipBg   = '#24292f'              /* always dark, like GitHub */
  const emptyBorder = isDark
    ? '1px solid rgba(255,255,255,0.06)'
    : '1px solid rgba(0,0,0,0.06)'

  useEffect(() => {
    Promise.all([
      fetch('https://github-contributions-api.jogruber.de/v4/danishrazabangash?y=last')
        .then(r => r.json()),
      fetch('https://api.github.com/users/danishrazabangash')
        .then(r => r.json()),
    ])
      .then(([cd, pd]) => { setContributions(cd.contributions || []); setProfile(pd) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const weeks     = useMemo(() => buildGrid(contributions), [contributions])
  const mLabels   = useMemo(() => getMonthLabels(weeks),   [weeks])
  const { yearTotal, longest, current } = useMemo(
    () => computeStats(contributions), [contributions]
  )

  /* ── graph width for container ── */
  const graphW = weeks.length * STEP + 28 /* day-label column */

  return (
    <section className="py-10 md:py-16 px-6" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/06">
                <GitHubIcon size={20} className="text-white/70" />
              </div>
              <div>
                <h3 className="text-white font-semibold">GitHub Activity</h3>
                <p className="text-white/40 text-xs">danishrazabangash</p>
              </div>
            </div>
            <a
              href="https://github.com/danishrazabangash"
              target="_blank" rel="noopener noreferrer"
              className="hidden sm:block text-xs text-white/40 hover:text-white transition-colors"
            >
              View Profile →
            </a>
          </div>

          {/* ── Profile stat chips — desktop only on mobile the graph is the focus ── */}
          {!loading && profile && (
            <div className="hidden sm:grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Repositories', value: profile.public_repos },
                { label: 'Followers',    value: profile.followers    },
                { label: 'Following',    value: profile.following    },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/04 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white">{value ?? '—'}</div>
                  <div className="text-[11px] text-white/35 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Contribution summary line ── */}
          {!loading && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
              <p className="text-sm text-white/60">
                <span className="font-semibold text-white">{yearTotal.toLocaleString()}</span>
                {' '}contributions in the last year
              </p>
              {current > 0 && (
                <p className="hidden sm:block text-sm text-white/40">
                  <span className="font-medium text-white/70">{current}-day</span> streak
                </p>
              )}
              {longest > 0 && (
                <p className="hidden sm:block text-sm text-white/40">
                  <span className="font-medium text-white/70">{longest}-day</span> longest
                </p>
              )}
            </div>
          )}

          {/* ── Contribution graph ── */}
          {loading ? (
            <div className="h-30 bg-white/04 rounded-xl animate-pulse" />
          ) : (
            <>
            <div className="overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch', WebkitScrollSnapType: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'inline-block', minWidth: graphW }}>

                {/* Month labels */}
                <div style={{ display: 'flex', paddingLeft: 28, marginBottom: 4, height: 15 }}>
                  {weeks.map((_, wi) => {
                    const ml = mLabels.find(l => l.wi === wi)
                    return (
                      <div key={wi} style={{ width: STEP, flexShrink: 0, position: 'relative' }}>
                        {ml && (
                          <span style={{
                            position: 'absolute', fontSize: 11,
                            color: labelColor, whiteSpace: 'nowrap',
                            lineHeight: '15px', userSelect: 'none',
                          }}>
                            {MONTHS[ml.m]}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Day labels + cell grid */}
                <div style={{ display: 'flex' }}>

                  {/* Day labels */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: GAP,
                    paddingTop: 1, width: 28, flexShrink: 0,
                  }}>
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
                      <div key={d} style={{
                        height: CELL, fontSize: 10,
                        color: labelColor, textAlign: 'right',
                        paddingRight: 6, lineHeight: `${CELL}px`,
                        userSelect: 'none',
                      }}>
                        {/* show Mon / Wed / Fri only */}
                        {i === 1 || i === 3 || i === 5 ? d : ''}
                      </div>
                    ))}
                  </div>

                  {/* Cells */}
                  <div style={{ display: 'flex', gap: GAP }}>
                    {weeks.map((week, wi) => (
                      <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                        {week.map((day, di) => {
                          const lvl = day.level
                          const bg  = lvl < 0
                            ? 'transparent'
                            : colors[Math.min(lvl, 4)]

                          return (
                            <div
                              key={di}
                              title={undefined}
                              style={{
                                width: CELL, height: CELL,
                                backgroundColor: bg,
                                border: lvl === 0 ? emptyBorder : 'none',
                                borderRadius: 2,
                                cursor: lvl >= 0 ? 'pointer' : 'default',
                                flexShrink: 0,
                              }}
                              onMouseEnter={lvl < 0 ? undefined : (e) => {
                                const r = e.currentTarget.getBoundingClientRect()
                                setTooltip({
                                  x: r.left + r.width / 2,
                                  y: r.top + window.scrollY,
                                  date:  day.date,
                                  count: day.count,
                                })
                              }}
                              onMouseLeave={lvl < 0 ? undefined : () => setTooltip(null)}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  gap: 4, marginTop: 8, paddingLeft: 28,
                }}>
                  <span style={{ fontSize: 11, color: labelColor, userSelect: 'none' }}>Less</span>
                  {colors.map((c, i) => (
                    <div key={i} style={{
                      width: CELL, height: CELL,
                      backgroundColor: c,
                      border: i === 0 ? emptyBorder : 'none',
                      borderRadius: 2,
                    }} />
                  ))}
                  <span style={{ fontSize: 11, color: labelColor, userSelect: 'none' }}>More</span>
                </div>

              </div>
              </div>
            </div>
            {/* Scroll hint — mobile only */}
            <p className="sm:hidden text-[10px] text-white/25 text-right mt-2 select-none">
              ← swipe to scroll →
            </p>
            </>
          )}

        </motion.div>
      </div>

      {/* ── Tooltip (fixed, follows cursor position) ── */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x,
          top: tooltip.y - 8,
          transform: 'translate(-50%, -100%)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}>
          <div style={{
            background: tooltipBg,
            color: '#e6edf3',
            fontSize: 12,
            padding: '5px 10px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {tooltip.count === 0
              ? `No contributions on ${fmtDate(tooltip.date)}`
              : `${tooltip.count} contribution${tooltip.count !== 1 ? 's' : ''} on ${fmtDate(tooltip.date)}`}
          </div>
          {/* caret */}
          <div style={{
            width: 0, height: 0, margin: '0 auto',
            borderLeft:  '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop:   `5px solid ${tooltipBg}`,
          }} />
        </div>
      )}
    </section>
  )
}
