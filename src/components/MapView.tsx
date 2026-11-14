import { AnimatePresence } from 'framer-motion'
import type { DemState } from '../hooks/useDem'
import { LayerPanel } from './LayerPanel'
import { Legend } from './Legend'
import { LoadingScreen } from './LoadingScreen'
import { ProbeReadout } from './ProbeReadout'
import { Scene3D } from './Scene3D'
import { SunControl } from './SunControl'
import { ViewControls } from './ViewControls'

export function MapView({ state }: { state: DemState }) {
  const { dem, fields, status, error, progress, stage, retry } = state

  return (
    <section className="relative h-[78svh] min-h-[560px] shrink-0 overflow-hidden lg:h-auto lg:min-h-0 lg:flex-1">
      {dem && fields && (
        <div className="absolute inset-0">
          <Scene3D dem={dem} fields={fields} />
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-5 top-5 z-30 flex items-start justify-between gap-6">
        <LayerPanel />
        <div className="flex shrink-0 flex-col items-end gap-3">
          <ViewControls />
          {error && (
            <p className="pointer-events-auto max-w-[32ch] text-right text-[12px] leading-relaxed text-zinc-400">
              <span className="text-ember">Elevation tiles could not be read.</span> Showing a
              synthetic volcano instead.{' '}
              <button type="button" onClick={retry} className="text-white underline underline-offset-4">
                Retry
              </button>
            </p>
          )}
        </div>
      </div>

      {dem && fields && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent px-5 pb-5 pt-16">
          <div className="grid items-end gap-x-10 gap-y-5 lg:grid-cols-[220px_1fr_200px]">
            <div className="hidden lg:block">
              <ProbeReadout dem={dem} fields={fields} />
            </div>
            <SunControl />
            <Legend dem={dem} />
          </div>
        </div>
      )}

      <AnimatePresence>
        {status === 'loading' && <LoadingScreen progress={progress} stage={stage} />}
      </AnimatePresence>
    </section>
  )
}
