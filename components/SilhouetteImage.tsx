import Image from 'next/image'

interface Props {
  spriteUrl: string
  revealed: boolean
  pokemonName: string
}

export default function SilhouetteImage({ spriteUrl, revealed, pokemonName }: Props) {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <Image
        src={spriteUrl}
        alt={revealed ? pokemonName : '???'}
        fill
        sizes="256px"
        className={`object-contain transition-all duration-700 ${
          revealed ? 'brightness-100' : 'brightness-0'
        }`}
        priority
      />
    </div>
  )
}
