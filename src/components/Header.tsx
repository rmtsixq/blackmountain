export function Header() {
  return (
    <header className="z-40 flex h-12 shrink-0 items-center justify-between gap-6 border-b border-white/10 px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <img src="/logo.webp" alt="" className="size-7" />
        <span className="text-[14px] font-medium text-white">BlackMountain</span>
        <span className="hidden truncate text-[13px] text-zinc-500 sm:inline">
          Karacadağ as a Moon and Mars analog
        </span>
      </div>
      <p className="shrink-0 font-mono text-[11px] text-zinc-500">
        <span className="hidden md:inline">37.71°N 39.83°E · </span>Space Apps 2026
      </p>
    </header>
  )
}
