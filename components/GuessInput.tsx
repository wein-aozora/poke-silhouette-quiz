'use client'

import { useState, type FormEvent } from 'react'

interface Props {
  onSubmit: (guess: string) => void
  disabled: boolean
}

export default function GuessInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    onSubmit(value)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        placeholder="ポケモンの名前を入力..."
        className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 disabled:opacity-50"
        autoComplete="off"
        autoFocus
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 rounded-lg font-bold text-gray-900 transition-colors"
      >
        答える
      </button>
    </form>
  )
}
