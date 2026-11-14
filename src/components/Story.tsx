import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion'
import type { World } from '../lib/layers'
import { buildStory, type Chapter } from '../lib/story'
import { useStore } from '../store'
import { StoryVisual } from './StoryVisual'

const AUTOPLAY_SECONDS = 9

function Figure({ figure }: { figure: NonNullable<Chapter['figure']> }) {
  const spring = useSpring(0, { stiffness: 50, damping: 18 })
  const text = useTransform(spring, (v) => v.toFixed(figure.decimals ?? 0))
  useEffect(() => {
    spring.set(figure.value)
  }, [figure.value, spring])
  return (
    <p className="flex items-end gap-3 font-display leading-[0.8] text-white">
      <motion.span className="text-[110px] tracking-tight sm:text-[168px]">{text}</motion.span>
      <span className="mb-3 max-w-[12ch] font-mono text-[11px] leading-snug text-ember">{figure.unit}</span>
    </p>
  )
}

/** One finding at a time, with the terrain staged behind it. */
export function Story({ world }: { world: World }) {
  const chapters = useMemo(() => buildStory(world), [world])
  const index = Math.min(useStore((s) => s.chapter), chapters.length - 1)
  const autoplay = useStore((s) => s.autoplay)
  const setChapter = useStore((s) => s.setChapter)
  const setAutoplay = useStore((s) => s.setAutoplay)
  const setMode = useStore((s) => s.setMode)
  const chapter = chapters[index]
  const last = index === chapters.length - 1

  // Stage the scene for this chapter; the sun eases to its new position.
  useEffect(() => {
    const s = useStore.getState()
    const { scene } = chapter
    s.setLayer(scene.layer)
    s.setTarget(scene.target)
    s.setTwin(scene.twin)
    s.setShot(scene.shot)
    s.setStations(Boolean(scene.stations))
    const from = s.hour
    const start = performance.now()
    let raf = 0
    const tick = () => {
      const k = Math.min(1, (performance.now() - start) / 2200)
      useStore.getState().setHour(from + (scene.hour - from) * k * k * (3 - 2 * k))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [chapter])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useStore.getState()
      if (e.key === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault()
        s.setChapter(Math.min(chapters.length - 1, s.chapter + 1))
      }
      if (e.key === 'ArrowLeft') s.setChapter(Math.max(0, s.chapter - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chapters.length])

  useEffect(() => {
    if (!autoplay) return
    const id = setTimeout(() => {
      if (last) setAutoplay(false)
      else setChapter(index + 1)
    }, AUTOPLAY_SECONDS * 1000)
    return () => clearTimeout(id)
  }, [autoplay, index, last, setAutoplay, setChapter])

  const link = 'transition-colors hover:text-white disabled:text-zinc-800 disabled:hover:text-zinc-800'

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-end bg-gradient-to-t from-ink-950 via-ink-950/55 to-transparent px-6 pb-6 sm:px-10 sm:pb-9">
      <div className="flex items-end justify-between gap-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-[640px]"
          >
            <p className="font-mono text-[11px] text-zinc-500">
              <span className="text-ember">0{index + 1}</span> / 0{chapters.length} · {chapter.kicker}
            </p>
            {chapter.figure && (
              <div className="mt-5">
                <Figure figure={chapter.figure} />
              </div>
            )}
            <h2 className="mt-5 font-display text-[34px] leading-[1.06] text-white sm:text-[48px]">
              {chapter.title}
            </h2>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-zinc-400">{chapter.body}</p>
            <p className="mt-4 font-mono text-[10px] text-zinc-600">{chapter.source}</p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {chapter.visual && (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden w-[420px] shrink-0 pb-12 pr-28 xl:block"
            >
              <StoryVisual kind={chapter.visual} world={world} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="pointer-events-auto mt-9 flex items-center gap-6 font-mono text-[11px] text-zinc-500">
        <div className="flex flex-1 gap-1.5">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              title={c.kicker}
              aria-label={`Chapter ${i + 1}: ${c.kicker}`}
              onClick={() => setChapter(i)}
              className="group h-5 flex-1"
            >
              <span
                className={`block h-px transition-colors ${
                  i === index ? 'bg-ember' : i < index ? 'bg-white/60' : 'bg-white/15 group-hover:bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setAutoplay(!autoplay)} className={autoplay ? 'text-ember' : link}>
          {autoplay ? 'pause' : 'autoplay'}
        </button>
        <button type="button" disabled={index === 0} onClick={() => setChapter(index - 1)} className={link}>
          ← back
        </button>
        {last ? (
          <button type="button" onClick={() => setMode('explore')} className="text-white underline decoration-ember underline-offset-4">
            open the data →
          </button>
        ) : (
          <button type="button" onClick={() => setChapter(index + 1)} className="text-white">
            next →
          </button>
        )}
      </nav>
    </div>
  )
}
