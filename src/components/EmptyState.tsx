import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  text: string
}

export function EmptyState({ icon: Icon, title, text }: Props) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-white/10 px-4 py-7 text-center">
      <Icon className="size-5 text-zinc-600" strokeWidth={1.5} />
      <p className="mt-2 text-[13px] font-medium text-zinc-300">{title}</p>
      <p className="mt-1 max-w-[30ch] text-[11px] leading-snug text-zinc-500">{text}</p>
    </div>
  )
}
