import { Search, X } from 'lucide-react'

export function SearchField({ value, onChange, placeholder, trailing }) {
  return (
    <label className="flex h-38 items-center gap-10 rounded-row border border-stroke bg-row px-12 transition-colors duration-200 ease-brand focus-within:border-white/20">
      <Search className="size-14 shrink-0 text-placeholder" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="h-full min-w-0 flex-1 text-body-sm font-medium text-text placeholder:text-placeholder"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="flex size-22 items-center justify-center rounded-[0.6rem] text-muted hover:bg-row-hover hover:text-white [&>svg]:size-12"
        >
          <X />
        </button>
      ) : trailing}
    </label>
  )
}
