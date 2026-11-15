import { useEffect } from 'react'
import { targetById } from '../data/targets'
import { useStore } from '../store'

/** Karacadağ ⇄ the selected target: same square, same vertical scale. */
export function TwinSwitch() {
  const twin = useStore((s) => s.twin)
  const setTwin = useStore((s) => s.setTwin)
  const target = targetById(useStore((s) => s.target))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.target instanceof HTMLInputElement) return
      e.preventDefault()
      const s = useStore.getState()
      s.setTwin(!s.twin)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const option = (on: boolean, world: string, name: string, onClick: () => void) => (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`group text-left transition-colors ${on ? 'text-ink' : 'text-ink-4 hover:text-ink-2'}`}
    >
      <span className={`block font-label text-[10px] ${on ? 'text-accent' : ''}`}>{world}</span>
      <span className="block font-display text-[26px] leading-tight sm:text-[32px]">{name}</span>
    </button>
  )

  return (
    <div className="pointer-events-auto">
      <div className="flex items-end gap-5">
        {option(!twin, 'Earth', 'Karacadağ', () => setTwin(false))}
        <button
          type="button"
          title="Switch world (space)"
          onClick={() => setTwin(!twin)}
          className="pb-1.5 font-display text-[26px] leading-none text-ink-3 transition-colors hover:text-ink"
        >
          ⇄
        </button>
        {option(twin, target.body, target.name, () => setTwin(true))}
      </div>
      <p className="mt-2 max-w-[44ch] font-label text-[10px] leading-relaxed text-ink-4">
        {twin
          ? `${target.coords} · ${target.demSource} · same 62 km square and vertical scale as Karacadağ`
          : 'Press space to turn this mountain into its twin: real elevation, same scale.'}
      </p>
    </div>
  )
}
