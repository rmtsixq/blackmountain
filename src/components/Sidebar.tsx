import { AnimatePresence, motion } from 'framer-motion'
import { Fingerprint, MapPinned, Unlink, type LucideIcon } from 'lucide-react'
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

const TABS: { id: SidebarTab; label: string; icon: LucideIcon }[] = [
  { id: 'fingerprint', label: 'Fingerprint', icon: Fingerprint },
  { id: 'field', label: 'Field data', icon: MapPinned },
  { id: 'limits', label: 'Limits', icon: Unlink },
]

export function Sidebar({ dem }: { dem: Dem | null }) {
  const tab = useStore((s) => s.tab)
  const setTab = useStore((s) => s.setTab)

  return (
    <aside className="flex w-full shrink-0 flex-col border-t border-white/8 bg-ink-900 lg:w-[440px] lg:overflow-y-auto lg:border-l lg:border-t-0">
      <div className="space-y-4 p-4">
        <TargetSelector />
        <ScoreHeader />
        <StatTiles dem={dem} />
      </div>

      <nav className="sticky top-0 z-10 flex gap-1 border-y border-white/8 bg-ink-900/95 px-4 py-2 backdrop-blur">
        {TABS.map((t) => {
          const on = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium transition-colors ${
                on ? 'text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {on && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-lg bg-white"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <t.icon className="relative size-3.5" strokeWidth={1.75} />
              <span className="relative">{t.label}</span>
            </button>
          )
        })}
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="space-y-3 p-4"
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
    </aside>
  )
}
