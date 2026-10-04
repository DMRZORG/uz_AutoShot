import { Kbd } from '../../ui/Kbd'

const CONTROLS = [
  ['LMB', 'Rotate'], ['RMB', 'Roll'], ['Scroll', 'Zoom'],
  ['W S', 'Height'], ['Q E', 'FOV'], ['R', 'Reset'], ['C', 'Copy values'],
]

export function OrbitHint({ copied }) {
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[9999] -translate-x-1/2 animate-enter">
      <div className="glass flex items-center gap-14 rounded-rail px-14 py-8">
        {copied ? (
          <span className="text-caption font-medium text-green">Camera values copied to the clipboard</span>
        ) : CONTROLS.map(([key, action]) => (
          <span key={key} className="flex items-center gap-6 text-caption font-medium text-muted">
            <Kbd>{key}</Kbd>
            {action}
          </span>
        ))}
      </div>
    </div>
  )
}
