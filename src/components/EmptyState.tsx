interface Props {
  title: string
  text: string
}

export function EmptyState({ title, text }: Props) {
  return (
    <p className="max-w-[40ch] text-[13px] leading-relaxed text-zinc-500">
      <span className="text-zinc-300">{title}.</span> {text}
    </p>
  )
}
