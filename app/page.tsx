'use client'

import { useState, useCallback, useEffect } from 'react'
import SilhouetteImage from '@/components/SilhouetteImage'
import GuessInput from '@/components/GuessInput'
import Timer from '@/components/Timer'
import ScoreBoard from '@/components/ScoreBoard'
import { getRandomPokemon, checkAnswer, type Pokemon } from '@/lib/pokeapi'

type Phase = 'loading' | 'playing' | 'revealed'
type Result = 'correct' | 'timeup' | 'giveup' | null

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [result, setResult] = useState<Result>(null)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timerKey, setTimerKey] = useState(0)

  const loadNext = useCallback(async () => {
    setPhase('loading')
    setResult(null)
    const p = await getRandomPokemon()
    setPokemon(p)
    setTimerKey(k => k + 1)
    setPhase('playing')
  }, [])

  useEffect(() => {
    loadNext()
  }, [loadNext])

  const handleGuess = useCallback(
    (guess: string) => {
      if (!pokemon || phase !== 'playing') return
      if (checkAnswer(guess, pokemon)) {
        setPhase('revealed')
        setResult('correct')
        setCorrect(c => c + 1)
        setTotal(t => t + 1)
        setStreak(s => s + 1)
      }
    },
    [pokemon, phase]
  )

  const handleTimeUp = useCallback(() => {
    if (phase !== 'playing') return
    setPhase('revealed')
    setResult('timeup')
    setTotal(t => t + 1)
    setStreak(0)
  }, [phase])

  const handleGiveUp = useCallback(() => {
    if (phase !== 'playing') return
    setPhase('revealed')
    setResult('giveup')
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
          ) : pokemon ? (
            <>
              <SilhouetteImage
                spriteUrl={pokemon.spriteUrl}
                revealed={phase === 'revealed'}
                pokemonName={pokemon.nameJa}
              />

              {phase === 'revealed' && (
                <div className="text-center">
                  <span
                    className={`text-lg font-bold ${
                      result === 'correct'
                        ? 'text-green-400'
                        : result === 'timeup'
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {result === 'correct' && '✓ 正解！'}
                    {result === 'timeup' && '✗ 時間切れ…'}
                    {result === 'giveup' && 'こたえ：'}
                  </span>
                  <span className="text-white text-lg font-bold ml-2">{pokemon.nameJa}</span>
                  <span className="text-gray-400 text-sm ml-1">({pokemon.nameEn})</span>
                </div>
              )}

              {phase === 'playing' && (
                <Timer
                  key={timerKey}
                  duration={30}
                  running
                  onTimeUp={handleTimeUp}
                />
              )}
            </>
          ) : null}

          {phase === 'playing' && (
            <>
              <GuessInput onSubmit={handleGuess} disabled={false} />
              <button
                onClick={handleGiveUp}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                わからない（答えを見る）
              </button>
            </>
          )}

          {phase === 'revealed' && (
            <button
              onClick={loadNext}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 rounded-xl font-bold text-gray-900 transition-colors"
            >
              次のポケモン →
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
