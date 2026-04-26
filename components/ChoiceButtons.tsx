import type { Pokemon } from '@/lib/pokeapi'

interface Props {
  choices: Pokemon[]
  answer: Pokemon
  selected: Pokemon | null
  onSelect: (choice: Pokemon) => void
}

export default function ChoiceButtons({ choices, answer, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {choices.map(choice => {
        let cls = 'bg-gray-700 hover:bg-gray-600 text-white cursor-pointer'
        if (selected) {
          if (choice.id === answer.id) {
            cls = 'bg-green-600 text-white cursor-default'
          } else if (selected.id === choice.id) {
            cls = 'bg-red-600 text-white cursor-default'
          } else {
            cls = 'bg-gray-700 opacity-40 text-gray-400 cursor-default'
          }
        }
        return (
          <button
            key={choice.id}
            onClick={() => !selected && onSelect(choice)}
            className={`px-4 py-3 rounded-xl font-bold transition-all text-left ${cls}`}
          >
            {choice.nameJa}
            <span className="text-sm font-normal ml-2 opacity-70">({choice.nameEn})</span>
          </button>
        )
      })}
    </div>
  )
}
