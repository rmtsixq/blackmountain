import { AnimatePresence } from 'framer-motion'
import { RefreshCw, TriangleAlert } from 'lucide-react'
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
    <section className="relative h-[72svh] min-h-[520px] shrink-0 overflow-hidden bg-ink-950 lg:h-auto lg:min-h-0 lg:flex-1">
      {dem && fields && (
        <div className="absolute inset-0">
          <Scene3D dem={dem} fields={fields} />
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex items-start justify-between gap-2">
        <LayerPanel />
        <div className="flex flex-col items-end gap-2">
          <ViewControls />
          {error && (
            <div className="pointer-events-auto flex max-w-xs items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-950/70 px-3 py-2.5 text-[11px] leading-snug text-red-200 backdrop-blur-md">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              <div>
                <p className="font-medium">Elevation tiles unavailable</p>
                <p className="mt-0.5 text-red-200/70">
                  Showing synthetic terrain instead. {error}
                </p>
                <button
                  type="button"
                  onClick={retry}
                  className="mt-1.5 flex items-center gap-1 font-medium text-white underline-offset-2 hover:underline"
                >
                  <RefreshCw className="size-3" /> Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {dem && fields && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-30 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="hidden lg:block lg:w-56">
            <ProbeReadout dem={dem} fields={fields} />
          </div>
          <SunControl />
          <Legend dem={dem} />
        </div>
      )}

      <AnimatePresence>
        {status === 'loading' && <LoadingScreen progress={progress} stage={stage} />}
      </AnimatePresence>
    </section>
  )
}
