import { BookOpen, Footprints, Satellite, type LucideIcon } from 'lucide-react'
import { useT } from '../lib/i18n'
import type { Evidence } from '../lib/story'

// The glyph and the words carry the distinction; the yellow only repeats it.
const ICON: Record<Evidence, LucideIcon> = {
  field: Footprints,
  orbit: Satellite,
  lab: BookOpen,
}

const TILE: Record<Evidence, string> = {
  field: 'bg-field text-on-field',
  orbit: 'bg-ink-3 text-paper',
  lab: 'bg-ink-3 text-paper',
}

/** Says where a chapter's evidence comes from: our own feet, orbit, or the literature. */
export function EvidenceTag({ kind }: { kind: Evidence }) {
  const { t } = useT()
  const Icon = ICON[kind]
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-2">
      <span className={`flex size-[22px] items-center justify-center rounded-[6px] ${TILE[kind]}`}>
        <Icon className="size-[13px]" strokeWidth={2.25} aria-hidden />
      </span>
      {t.evidence[kind]}
    </span>
  )
}
