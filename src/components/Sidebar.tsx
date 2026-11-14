import { AnimatePresence, motion } from 'framer-motion'
import type { Dem } from '../lib/dem'
import { useStore, type SidebarTab } from '../store'
import { AxisList } from './AxisList'
import { FingerprintRadar } from './FingerprintRadar'
import { LightTestChart } from './LightTestChart'
import { LimitsPanel } from './LimitsPanel'
import { RockAbundanceChart } from './RockAbundanceChart'
import { ScoreHeader } from './ScoreHeader'
import { StatTiles } from './StatTiles'
import { StationDetail } from './StationDetail'
import { TargetSelector } from './TargetSelector'
import { TubeProfileChart } from './TubeProfileChart'

const TABS: { id: SidebarTab; label: string }[] = [
  { id: 'fingerprint', label: 'Fingerprint' },
  { id: 'field', label: 'Field' },
  { id: 'limits', label: 'Limits' },
]

/** The reading column: one answer at the top, the evidence below. */
export function Sidebar({ dem }: { dem: Dem | null }) {
  const tab = useStore((s) => s.tab)
  const setTab = useStore((s) => s.setTab)

  return (
    <aside className="w-full shrink-0 border-t border-white/10 px-5 lg:w-[430px] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-7">
      <div className="pb-7 pt-6">
        <ScoreHeader />
        <div className="mt-7 border-t border-white/10">
          <TargetSelector />
        </div>
        <div className="mt-5">
          <StatTiles dem={dem} />
        </div>
      </div>

      <nav className="sticky top-0 z-10 flex gap-6 border-t border-white/10 bg-ink-950 py-3 text-[14px]">
        {TABS.map((t) => {
          const on = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative pb-1 transition-colors ${
                on ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {t.label}
              {on && (
                <motion.span
                  layoutId="tab-rule"
                  className="absolute inset-x-0 -bottom-px h-px bg-ember"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          )
        })}
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {tab === 'fingerprint' && (
            <>
              <FingerprintRadar />
              <AxisList />
            </>
          )}
          {tab === 'field' && (
            <>
              <StationDetail />
              <TubeProfileChart />
              <RockAbundanceChart />
              <LightTestChart />
            </>
          )}
          {tab === 'limits' && <LimitsPanel />}
        </motion.div>
      </AnimatePresence>

      <p className="border-t border-white/10 py-6 text-[12px] leading-relaxed text-zinc-600">
        † Placeholder values. Elevation, slope and the sun's position are computed from real data;
        temperature, radar, scores and station readings are simulated until the field and
        satellite data are loaded.
      </p>
    </aside>
  )
}
