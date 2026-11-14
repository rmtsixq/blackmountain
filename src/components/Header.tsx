import { FlaskConical, MapPin } from 'lucide-react'

export function Header() {
  return (
    <header className="z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/8 bg-ink-950 px-4">
      <div className="flex min-w-0 items-center gap-3">
        <img src="/logo.webp" alt="" className="size-9 rounded-lg ring-1 ring-white/10" />
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold leading-none tracking-[0.22em] text-white">
            BLACKMOUNTAIN
          </h1>
          <p className="mt-1 truncate text-[11px] leading-none text-zinc-500">
            Karacadağ twin-sensor analog fingerprint
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
        <span className="hidden items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-zinc-400 md:flex">
          <MapPin className="size-3" strokeWidth={1.75} />
          37.71°N 39.83°E · Türkiye
        </span>
        <span
          title="Elevation, slope and sun geometry are real. Thermal, radar, scores and field readings are placeholders."
          className="flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-amber-300"
        >
          <FlaskConical className="size-3" strokeWidth={1.75} />
          Demo data
        </span>
        <span className="hidden rounded-full border border-white/10 px-2.5 py-1 text-zinc-400 sm:block">
          NASA Space Apps 2026
        </span>
      </div>
    </header>
  )
}
