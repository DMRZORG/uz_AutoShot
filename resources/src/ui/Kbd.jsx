export function Kbd({ children }) {
  return (
    <kbd className="inline-flex h-20 min-w-20 items-center justify-center rounded-[0.5rem] border border-stroke bg-chip px-6 font-sans text-help font-semibold text-white">
      {children}
    </kbd>
  )
}
