import { AnimatePresence, motion } from 'framer-motion'
import { useStore, type SidebarTab } from '../store'
import { AxisList } from './AxisList'
import { FingerprintRadar } from './FingerprintRadar'
import { Leaderboard } from './Leaderboard'
import { LimitsPanel } from './LimitsPanel'
import { LstYearChart } from './LstYearChart'
import { RockAbundanceChart } from './RockAbundanceChart'
import { ScoreHeader } from './ScoreHeader'
import { ShadowChart } from './ShadowChart'
import { SlopeChart } from './SlopeChart'
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
export function Sidebar() {
  const world = useStore((s) => s.world)
  const tab = useStore((s) => s.tab)
  const setTab = useStore((s) => s.setTab)
  const shell =
    'w-full shrink-0 border-t border-ink/10 px-5 lg:w-[430px] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-7'

  if (!world) {
    return (
      <aside className={shell}>
        <div className="animate-pulse space-y-4 py-8">
          <div className="h-24 w-32 bg-ink/5" />
          <div className="h-4 w-3/4 bg-ink/5" />
          <div className="h-4 w-2/3 bg-ink/5" />
        </div>
      </aside>
    )
  }

  return (
    <aside className={shell}>
      <div className="pb-7 pt-6">
        <ScoreHeader world={world} />
        <div className="mt-7 border-t border-ink/10">
          <TargetSelector world={world} />
        </div>
        <div className="mt-5">
          <StatTiles world={world} />
        </div>
      </div>

      <nav className="sticky top-0 z-10 flex gap-6 border-t border-ink/10 bg-paper py-3 text-[14px]">
        {TABS.map((t) => {
          const on = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative pb-1 transition-colors ${
                on ? 'text-ink' : 'text-ink-3 hover:text-ink'
              }`}
            >
              {t.label}
              {on && (
                <motion.span
                  layoutId="tab-rule"
                  className="absolute inset-x-0 -bottom-px h-px bg-accent"
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
              <Leaderboard world={world} />
              <SlopeChart world={world} />
              <ShadowChart world={world} />
              <FingerprintRadar world={world} />
              <AxisList world={world} />
            </>
          )}
          {tab === 'field' && (
            <>
              <LstYearChart world={world} />
              <StationDetail />
              <TubeProfileChart />
              <RockAbundanceChart />
            </>
          )}
          {tab === 'limits' && <LimitsPanel world={world} />}
        </motion.div>
      </AnimatePresence>

      <p className="border-t border-ink/10 py-6 text-[12px] leading-relaxed text-ink-4">
        Elevation (Earth, Moon, Mars), VIIRS surface temperature, Sentinel-1 radar and the sun's
        position are real data; every terrain and light score is computed from them in the
        browser. Rock chemistry scores come from published analyses. † marks what is still a
        placeholder: the station readings, tube profile and rock counts awaiting the field
        campaign.
      </p>
    </aside>
  )
}
