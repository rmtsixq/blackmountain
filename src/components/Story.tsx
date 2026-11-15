import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useT } from '../lib/i18n'
import type { World } from '../lib/layers'
import { buildStory, type Chapter } from '../lib/story'
import { useStore } from '../store'
import { EvidenceTag } from './EvidenceTag'
import { StoryVisual } from './StoryVisual'

const AUTOPLAY_SECONDS = 11

const round =
  'flex size-9 items-center justify-center rounded-full bg-paper-2 text-ink transition-colors hover:bg-rule disabled:text-ink-5 disabled:hover:bg-paper-2'

const enter = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: [0.28, 0.11, 0.32, 1] as const },
}

function Tags({ chapter, centred }: { chapter: Chapter; centred?: boolean }) {
  if (!chapter.evidence.length) return null
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${centred ? 'justify-center' : ''}`}>
      {chapter.evidence.map((kind) => (
        <EvidenceTag key={kind} kind={kind} />
      ))}
    </div>
  )
}

/** The opening: the field panorama edge to edge, the question under it. */
function Cover({ chapter }: { chapter: Chapter }) {
  const banner = chapter.plate.kind === 'cover' ? chapter.plate : null
  return (
    <div className="absolute inset-x-0 bottom-14 top-0 flex flex-col overflow-y-auto px-3 pt-3 lg:px-6 lg:pt-6">
      {banner && (
        <motion.img
          src={banner.src}
          alt={banner.alt}
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.28, 0.11, 0.32, 1] }}
          className="aspect-[16/8] w-full shrink-0 rounded-[22px] object-cover sm:aspect-[1600/366] lg:rounded-[28px]"
        />
      )}
      <motion.article
        {...enter}
        transition={{ ...enter.transition, delay: 0.15 }}
        className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col items-center justify-center px-3 py-8 text-center"
      >
        <Tags chapter={chapter} centred />
        <h1 className="mt-5 text-balance font-display text-[36px] leading-[1.06] text-ink sm:text-[52px] xl:text-[68px]">
          {chapter.title}
        </h1>
        <p className="mt-5 max-w-[62ch] text-pretty text-[17px] leading-[1.47] text-ink-2 sm:text-[19px] xl:text-[21px] xl:leading-[1.4]">
          {chapter.body}
        </p>
        <p className="mt-5 text-[13px] text-ink-4">{chapter.source}</p>
      </motion.article>
    </div>
  )
}

/** One finding at a time: the text on the page, its evidence in the tile. */
export function Story({ world }: { world: World }) {
  const { lang, t } = useT()
  const chapters = useMemo(() => buildStory(world, lang), [world, lang])
  const index = Math.min(useStore((s) => s.chapter), chapters.length - 1)
  const autoplay = useStore((s) => s.autoplay)
  const setChapter = useStore((s) => s.setChapter)
  const setAutoplay = useStore((s) => s.setAutoplay)
  const setMode = useStore((s) => s.setMode)
  const chapter = chapters[index]
  const last = index === chapters.length - 1

  // Stage the tile for this chapter; the sun eases to its new position.
  useEffect(() => {
    const s = useStore.getState()
    const { scene } = chapter
    s.setPlate(chapter.plate)
    s.setLayer(scene.layer)
    s.setTarget(scene.target)
    s.setTwin(scene.twin)
    s.setShot(scene.shot)
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
      if (s.lang === null) return
      if (e.key === 'ArrowRight') s.setChapter(Math.min(chapters.length - 1, s.chapter + 1))
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

  return (
    <>
      <AnimatePresence mode="wait">
        {chapter.plate.kind === 'cover' ? (
          <motion.div key="cover" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Cover chapter={chapter} />
          </motion.div>
        ) : (
          <motion.div key="spread" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="absolute inset-x-0 bottom-14 top-[calc(38%+1.5rem)] overflow-y-auto px-5 pb-4 sm:px-8 lg:left-0 lg:right-auto lg:top-0 lg:w-[44%] lg:px-10 lg:pt-10 xl:px-14 xl:pt-14">
              <AnimatePresence mode="wait">
                <motion.article key={chapter.id} {...enter} className="max-w-[560px]">
                  <Tags chapter={chapter} />
                  <h2 className="mt-4 text-balance font-display text-[30px] leading-[1.08] text-ink sm:text-[38px] xl:text-[46px]">
                    {chapter.title}
                  </h2>
                  {chapter.figure && (
                    <p className="mt-4 text-[21px] font-semibold leading-snug tracking-[-0.018em] xl:text-[24px]">
                      <span className="text-ink">{chapter.figure.strong}</span>{' '}
                      <span className="text-ink-4">{chapter.figure.rest}</span>
                    </p>
                  )}
                  <p className="mt-4 max-w-[54ch] text-pretty text-[17px] leading-[1.47] text-ink-2 xl:text-[18px]">
                    {chapter.body}
                  </p>
                  {chapter.visual && (
                    <div className="mt-7 border-t border-rule pt-6">
                      <StoryVisual kind={chapter.visual} world={world} />
                    </div>
                  )}
                  <p className="mt-6 text-[13px] leading-snug text-ink-4 lg:hidden">{chapter.source}</p>
                </motion.article>
              </AnimatePresence>
            </div>

            {/* the tile's caption */}
            <p className="absolute bottom-14 left-[44%] right-6 hidden h-11 items-center px-1 text-[13px] leading-snug text-ink-4 lg:flex">
              <span className="line-clamp-2">{chapter.source}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <nav aria-label={t.chapters} className="absolute inset-x-0 bottom-0 grid h-14 grid-cols-[1fr_auto_1fr] items-center px-4 lg:px-6">
        <div>
          <button
            type="button"
            onClick={() => setAutoplay(!autoplay)}
            aria-label={autoplay ? t.pause : t.play}
            title={autoplay ? t.pause : t.play}
            className={round}
          >
            {autoplay ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4" fill="currentColor" />}
          </button>
        </div>

        {/* page control: one neutral dot per chapter, the current one solid */}
        <div className="flex items-center">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              title={c.kicker}
              aria-label={t.page(c.kicker, i + 1, chapters.length)}
              aria-current={i === index ? 'page' : undefined}
              onClick={() => setChapter(i)}
              className="group flex size-6 items-center justify-center rounded-full"
            >
              <span
                className={`size-2 rounded-full transition-colors duration-200 ${
                  i === index ? 'bg-ink' : 'bg-ink-5 group-hover:bg-ink-4'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setChapter(index - 1)}
            aria-label={t.previous}
            title={t.previous}
            className={round}
          >
            <ChevronLeft className="size-5" />
          </button>
          {last ? (
            <button
              type="button"
              onClick={() => setMode('explore')}
              className="h-9 rounded-full bg-ink px-4 text-[14px] font-medium text-paper transition-opacity hover:opacity-85"
            >
              {t.openData}
            </button>
          ) : (
            <button type="button" onClick={() => setChapter(index + 1)} aria-label={t.next} title={t.next} className={round}>
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>
      </nav>
    </>
  )
}
