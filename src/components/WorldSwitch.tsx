import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { TARGETS, targetById } from '../data/targets'
import { useT } from '../lib/i18n'
import { useStore } from '../store'

const DOT = { Earth: 'var(--ink)', Mars: 'var(--accent)', Moon: 'var(--ink-4)' }

/**
 * Which world the tile shows: Karacadağ, or one of the three places it is
 * compared with. One line of names; the space bar flips between the two.
 */
export function WorldSwitch() {
  const twin = useStore((s) => s.twin)
  const setTwin = useStore((s) => s.setTwin)
  const setTarget = useStore((s) => s.setTarget)
  const target = targetById(useStore((s) => s.target))
  const { x } = useT()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) return
      e.preventDefault()
      const s = useStore.getState()
      s.setTwin(!s.twin)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const worlds = [
    { id: 'earth', kind: 'Earth' as const, name: 'Karacadağ', tag: x('Earth · Türkiye'), on: !twin, pick: () => setTwin(false) },
    ...TARGETS.map((t) => ({
      id: t.id,
      kind: t.body,
      name: t.short,
      tag: `${x(t.tag)} · ${t.coords}`,
      on: twin && t.id === target.id,
      pick: () => {
        setTarget(t.id)
        setTwin(true)
      },
    })),
  ]

  return (
    <div
      role="radiogroup"
      aria-label={x('World shown')}
      className="pointer-events-auto flex min-w-0 max-w-full items-center gap-5 overflow-x-auto"
    >
      {worlds.map((w) => (
        <button
          key={w.id}
          type="button"
          role="radio"
          aria-checked={w.on}
          title={w.tag}
          onClick={w.pick}
          className={`relative flex shrink-0 items-center gap-1.5 pb-1.5 text-[14px] transition-colors ${
            w.on ? 'font-semibold text-ink' : 'text-ink-3 hover:text-ink'
          }`}
        >
          <span className="size-1.5 rounded-full" style={{ background: DOT[w.kind] }} />
          {w.name}
          {w.on && (
            <motion.span
              layoutId="world-rule"
              className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-ink"
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
