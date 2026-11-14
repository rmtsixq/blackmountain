import { Home, RotateCw } from 'lucide-react'
import { useStore } from '../store'

export function ViewControls() {
  const exag = useStore((s) => s.exag)
  const setExag = useStore((s) => s.setExag)
  const autoRotate = useStore((s) => s.autoRotate)
  const setAutoRotate = useStore((s) => s.setAutoRotate)
  const resetView = useStore((s) => s.resetView)

  return (
    <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-white/10 bg-ink-900/80 p-1.5 shadow-lg shadow-black/50 backdrop-blur-md">
      <label className="hidden items-center gap-2 px-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500 md:flex">
        Relief
        <input
          type="range"
          min={1}
          max={6}
          step={0.5}
          value={exag}
          onChange={(e) => setExag(Number(e.target.value))}
          className="h-1 w-20 cursor-pointer accent-white"
          aria-label="Vertical exaggeration"
        />
        <span className="w-6 text-zinc-200">×{exag}</span>
      </label>
      <button
        type="button"
        title="Auto-rotate"
        aria-pressed={autoRotate}
        onClick={() => setAutoRotate(!autoRotate)}
        className={`rounded-lg p-2 transition-colors ${
          autoRotate ? 'bg-white text-black' : 'text-zinc-400 hover:bg-white/8 hover:text-white'
        }`}
      >
        <RotateCw className="size-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        title="Reset view"
        onClick={resetView}
        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/8 hover:text-white"
      >
        <Home className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  )
}
