export const AXIS_TICK = { fill: 'var(--ink-3)', fontSize: 11, fontFamily: 'var(--font-label)' }
export const GRID_STROKE = 'var(--rule)'

export const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'var(--paper)',
    border: '1px solid var(--rule)',
    borderRadius: 12,
    boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
    fontSize: 12,
    padding: '8px 10px',
  },
  labelStyle: { color: 'var(--ink-3)', marginBottom: 4 },
  itemStyle: { padding: 0 },
} as const
