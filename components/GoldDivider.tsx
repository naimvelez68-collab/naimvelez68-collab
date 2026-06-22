export default function Divider({ color = 'var(--grullo)', width = 64 }: { color?: string; width?: number }) {
  return (
    <div style={{ width: `${width}px`, height: '1px', background: `linear-gradient(to right, transparent, ${color}, transparent)`, margin: '0 auto' }} />
  )
}
