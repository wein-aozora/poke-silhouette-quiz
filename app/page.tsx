'use client'

import { useState, useCallback, useEffect } from 'react'
import SilhouetteImage from '@/components/SilhouetteImage'
import ChoiceButtons from '@/components/ChoiceButtons'
import Timer from '@/components/Timer'
import ScoreBoard from '@/components/ScoreBoard'
import { getQuizData, type Pokemon, type QuizData } from '@/lib/pokeapi'

type Phase = 'loading' | 'playing' | 'revealed'
type Result = 'correct' | 'wrong' | 'timeup' | null

export default function Home() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [result, setResult] = useState<Result>(null)
  const [selected, setSelected] = useState<Pokemon | null>(null)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timerKey, setTimerKey] = useState(0)

  const loadNext = useCallback(async () => {
    setPhase('loading')
    setResult(null)
    setSelected(null)
    const data = await getQuizData()
    setQuizData(data)
    setTimerKey(k => k + 1)
    setPhase('playing')
  }, [])

  useEffect(() => {
    loadNext()
  }, [loadNext])

  const handleChoice = useCallback(
    (choice: Pokemon) => {
      if (!quizData || phase !== 'playing') return
      setSelected(choice)
      setPhase('revealed')
      setTotal(t => t + 1)
      if (choice.id === quizData.answer.id) {
        setResult('correct')
        setCorrect(c => c + 1)
        setStreak(s => s + 1)
      } else {
        setResult('wrong')
        setStreak(0)
      }
    },
    [quizData, phase]
  )

  const handleTimeUp = useCallback(() => {
    if (phase !== 'playing') return
    setPhase('revealed')
    setResult('timeup')
    setTotal(t => t + 1)
    setStreak(0)
  }, [phase])

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-yellow-400">ポケモン</span> シルエットクイズ
      </h1>
      <p className="text-gray-400 text-sm mb-6">このポケモン、だーれだ？</p>

      <div className="w-full max-w-md flex flex-col gap-6 items-center">
        <ScoreBoard correct={correct} total={total} streak={streak} />

        <div className="w-full bg-gray-800 rounded-2xl p-6 flex flex-col gap-4 items-center shadow-xl">
          {phase === 'loading' ? (
            <div className="w-64 h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
            </div>
          ) : quizData ? (
            <>
              <SilhouetteImage
                spriteUrl={quizData.answer.spriteUrl}
                revealed={phase === 'revealed'}
                pokemonName={quizData.answer.nameJa}
              />

              {phase === 'revealed' && (
                <p className={`text-lg font-bold ${
                  result === 'correct' ? 'text-green-400' :
                  result === 'wrong'   ? 'text-red-400'   : 'text-gray-400'
                }`}>
                  {result === 'correct' && '✓ 正解！'}
                  {result === 'wrong'   && '✗ 不正解…'}
                  {result === 'timeup'  && '⏰ 時間切れ！'}
                </p>
              )}

              {phase === 'playing' && (
                <Timer key={timerKey} duration={30} running onTimeUp={handleTimeUp} />
              )}

              <ChoiceButtons
                choices={quizData.choices}
                answer={quizData.answer}
                selected={selected}
                onSelect={handleChoice}
              />
            </>
          ) : null}

          {phase === 'revealed' && (
            <button
              onClick={loadNext}
              className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-400 rounded-xl font-bold text-gray-900 transition-colors"
            >
              次のポケモン →
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
