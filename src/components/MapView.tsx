import { AnimatePresence } from 'framer-motion'
import type { WorldState } from '../hooks/useWorld'
import { useStore } from '../store'
import { Caption } from './Caption'
import { LayerPanel } from './LayerPanel'
import { Legend } from './Legend'
import { LoadingScreen } from './LoadingScreen'
import { ProbeReadout } from './ProbeReadout'
import { Scene3D } from './Scene3D'
import { SunControl } from './SunControl'
import { Tour } from './Tour'
import { TwinSwitch } from './TwinSwitch'
import { ViewControls } from './ViewControls'

export function MapView({ state }: { state: WorldState }) {
  const { world, status, error, progress, stage, retry } = state
  const touring = useStore((s) => s.touring)
  // during the tour the instruments step back and the caption takes over
  const chrome = `transition-opacity duration-500 ${touring ? 'pointer-events-none opacity-0' : ''}`

  return (
    <section className="relative h-[82svh] min-h-[600px] shrink-0 overflow-hidden lg:h-auto lg:min-h-0 lg:flex-1">
      {world && (
        <div className="absolute inset-0">
          <Scene3D world={world} />
        </div>
      )}

      {/* keeps the layer list legible when tall terrain passes behind it */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-80 bg-gradient-to-r from-ink-950/90 to-transparent" />

      {world && (
        <div className="pointer-events-none absolute inset-x-5 top-5 z-30 flex items-start justify-between gap-6">
          <div className={chrome}>
            <TwinSwitch />
            <div className="mt-7">
              <LayerPanel />
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-3">
            <Tour />
            <div className={chrome}>
              <ViewControls />
            </div>
          </div>
        </div>
      )}

      {world && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent px-5 pb-5 pt-16">
          {touring ? (
            <div className="pb-6">
              <Caption />
            </div>
          ) : (
            <div className="grid items-end gap-x-10 gap-y-5 lg:grid-cols-[220px_1fr_200px]">
              <div className="hidden lg:block">
                <ProbeReadout world={world} />
              </div>
              <SunControl />
              <Legend world={world} />
            </div>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-[32px] text-white">The data did not load.</p>
          <p className="mt-2 max-w-[44ch] text-[13px] leading-relaxed text-zinc-500">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-5 text-[13px] text-white underline decoration-ember underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      <AnimatePresence>
        {status === 'loading' && <LoadingScreen progress={progress} stage={stage} />}
      </AnimatePresence>
    </section>
  )
}
