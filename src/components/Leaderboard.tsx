import { targetById } from '../data/targets'
import { BASELINE_M, rankSites } from '../lib/analysis'
import type { World } from '../lib/layers'
import { useStore } from '../store'
import { Panel } from './Panel'

/** Karacadağ among the established analog sites, all scored the same way. */
export function Leaderboard({ world }: { world: World }) {
  const target = targetById(useStore((s) => s.target))
  const ranked = rankSites(world.analysis, target.id)

  return (
    <Panel
      title="Against the analog sites NASA already uses"
      hint={`Eight 62 km squares of Earth, each compared with ${target.name} by slope, roughness and relief at a ${BASELINE_M} m baseline. Light is the overlap of their shadow curves.`}
    >
      <div className="mb-2 flex items-baseline gap-3 font-label text-[10px] text-ink-4">
        <span className="w-4" />
        <span className="flex-1">site</span>
        <span className="w-10 text-right">light</span>
        <span className="w-10 text-right">terrain</span>
      </div>
      <ol>
        {ranked.map((s, i) => {
          const score = s.topo[target.id]
          return (
            <li key={s.id} className="border-t border-ink/10 py-2.5">
              <div className={`flex items-baseline gap-3 ${s.home ? 'text-ink' : 'text-ink-2'}`}>
                <span className={`w-4 font-label text-[11px] ${s.home ? 'text-accent' : 'text-ink-4'}`}>
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px]">
                  {s.name}
                  <span className="ml-2 font-label text-[10px] text-ink-4">{s.region}</span>
                </span>
                <span className="w-10 text-right font-label text-[12px] tabular-nums text-ink-3">
                  {s.light[target.id].toFixed(0)}
                </span>
                <span className="w-10 text-right font-label text-[13px] tabular-nums">
                  {score.toFixed(0)}
                </span>
              </div>
              <div className="ml-7 mt-2 h-px bg-ink/10">
                <div
                  className={`h-px transition-all duration-500 ${s.home ? 'bg-accent' : 'bg-ink-2'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-[12px] leading-relaxed text-ink-4">
        Each square is centred on the site named; a different window would score differently.
        Terrain only: this says nothing yet about rock, dust or temperature.
      </p>
    </Panel>
  )
}
