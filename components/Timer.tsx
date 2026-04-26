'use client'

import { useEffect, useState } from 'react'

interface Props {
  duration: number
  running: boolean
  onTimeUp: () => void
}

export default function Timer({ duration, running, onTimeUp }: Props) {
  const [seconds, setSeconds] = useState(duration)

  useEffect(() => {
    setSeconds(duration)
  }, [duration])

  useEffect(() => {
    if (!running) return
    if (seconds <= 0) {
      onTimeUp()
      return
    }
    const id = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds, running, onTimeUp])

  const pct = (seconds / duration) * 100
  const barColor =
    seconds > 10 ? 'bg-green-400' : seconds > 5 ? 'bg-yellow-400' : 'bg-red-400'

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">残り時間</span>
        <span className={`font-bold ${seconds <= 5 ? 'text-red-400' : 'text-white'}`}>
          {seconds}s
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
