interface Props {
  title: string
  text: string
}

export function EmptyState({ title, text }: Props) {
  return (
    <p className="max-w-[40ch] text-[13px] leading-relaxed text-ink-3">
      <span className="text-ink-2">{title}.</span> {text}
    </p>
  )
}
