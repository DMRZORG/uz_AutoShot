import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    theme: { text: ['chip', 'help', 'caption', 'body-sm', 'body', 'title', 'number'] },
  },
})

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
