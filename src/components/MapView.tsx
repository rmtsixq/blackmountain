import { AnimatePresence, motion } from 'framer-motion'
import type { WorldState } from '../hooks/useWorld'
import { useT } from '../lib/i18n'
import { useStore } from '../store'
import { LayerPanel } from './LayerPanel'
import { Legend } from './Legend'
import { LoadingScreen } from './LoadingScreen'
import { PitCloud } from './PitCloud'
import { ProbeReadout } from './ProbeReadout'
import { Scene3D } from './Scene3D'
import { Story } from './Story'
import { SunControl } from './SunControl'
import { WorldSwitch } from './WorldSwitch'
import { ViewControls } from './ViewControls'

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45 },
}

/**
 * The page and its media tile. In Findings the tile sits beside the text and
 * shows the terrain, a field photograph or the scan; in Data it fills the
 * view and carries the instrument controls.
 */
export function MapView({ state }: { state: WorldState }) {
  const { world, status, error, progress, stage, retry } = state
  const { t } = useT()
  const mode = useStore((s) => s.mode)
  const plate = useStore((s) => s.plate)
  const story = mode === 'story'
  const terrain = !story || plate.kind === 'terrain'
  const cover = story && plate.kind === 'cover'

  return (
    <section className="relative h-[calc(100svh-3rem)] min-h-[620px] shrink-0 overflow-hidden lg:h-auto lg:min-h-0 lg:flex-1">
      <div
        className={`plate absolute overflow-hidden bg-paper ${
          story
            ? 'inset-x-3 top-3 h-[38%] rounded-[22px] lg:bottom-[6.25rem] lg:left-[44%] lg:right-6 lg:top-6 lg:h-auto lg:rounded-[28px]'
            : 'inset-3 rounded-[22px] lg:rounded-[28px]'
        } ${cover ? 'invisible' : ''}`}
      >
        {world && (
          <div className={`absolute inset-0 ${terrain ? '' : 'invisible'}`}>
            <Scene3D world={world} />
          </div>
        )}

        <AnimatePresence>
          {story && plate.kind === 'photo' && (
            <motion.img
              key={plate.src}
              src={plate.src}
              alt={plate.alt}
              {...fade}
              className="absolute inset-0 size-full object-cover"
            />
          )}
          {story && plate.kind === 'scan' && (
            <motion.div key="scan" {...fade} className="absolute inset-0">
              <PitCloud />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {world && !story && (
            <motion.div key="explore" {...fade}>
              {/* floating controls: which world, which layer, how it is viewed */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-paper/85 to-transparent" />
              <div className="pointer-events-none absolute inset-x-5 top-4 z-30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                  <WorldSwitch />
                  <ViewControls />
                </div>
                <LayerPanel />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-paper via-paper/80 to-transparent px-5 pb-5 pt-16">
                <div className="grid items-end gap-x-10 gap-y-5 lg:grid-cols-[220px_1fr_200px]">
                  <div className="hidden lg:block">
                    <ProbeReadout world={world} />
                  </div>
                  <SunControl />
                  <Legend world={world} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {world && story && <Story world={world} />}

      {status === 'error' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-paper px-6 text-center">
          <p className="font-display text-[28px] text-ink">{t.dataFailed}</p>
          <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-ink-3">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-5 h-9 rounded-full bg-ink px-4 text-[14px] font-medium text-paper transition-opacity hover:opacity-85"
          >
            {t.retry}
          </button>
        </div>
      )}

      <AnimatePresence>
        {status === 'loading' && <LoadingScreen progress={progress} stage={stage} />}
      </AnimatePresence>
    </section>
  )
}
