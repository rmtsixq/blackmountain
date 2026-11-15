import { Fragment, type ReactNode } from 'react'

/**
 * Fills `{name}` slots in a translated sentence with elements, so word order
 * can differ between languages while the emphasised numbers stay styled.
 */
export function rich(text: string, parts: Record<string, ReactNode>): ReactNode[] {
  return text.split(/(\{\w+\})/).map((piece, i) => {
    const key = /^\{(\w+)\}$/.exec(piece)?.[1]
    return <Fragment key={i}>{key && key in parts ? parts[key] : piece}</Fragment>
  })
}
