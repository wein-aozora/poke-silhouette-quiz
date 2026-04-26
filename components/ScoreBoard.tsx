interface Props {
  correct: number
  total: number
  streak: number
}

export default function ScoreBoard({ correct, total, streak }: Props) {
  return (
    <div className="flex gap-8 justify-center text-center">
      <div>
        <div className="text-2xl font-bold text-white">
          {correct}
          <span className="text-gray-500 text-lg">/{total}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">正解数</div>
      </div>
      <div className="w-px bg-gray-700" />
      <div>
        <div className="text-2xl font-bold text-yellow-400">{streak}</div>
        <div className="text-xs text-gray-400 mt-1">連続正解 🔥</div>
      </div>
    </div>
  )
}
