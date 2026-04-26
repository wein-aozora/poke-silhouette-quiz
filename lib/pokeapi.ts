export interface Pokemon {
  id: number
  nameEn: string
  nameJa: string
  spriteUrl: string
}

const TOTAL_POKEMON = 1025

export async function getRandomPokemon(): Promise<Pokemon> {
  const id = Math.floor(Math.random() * TOTAL_POKEMON) + 1

  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ])

  const pokemon = await pokemonRes.json()
  const species = await speciesRes.json()

  const nameJa =
    species.names?.find(
      (n: { language: { name: string }; name: string }) => n.language.name === 'ja'
    )?.name ?? pokemon.name

  const spriteUrl =
    pokemon.sprites?.other?.['official-artwork']?.front_default ??
    pokemon.sprites?.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

  return { id, nameEn: pokemon.name, nameJa, spriteUrl }
}

export function checkAnswer(guess: string, pokemon: Pokemon): boolean {
  const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '')
  return (
    normalize(guess) === normalize(pokemon.nameEn) ||
    normalize(guess) === normalize(pokemon.nameJa)
  )
}
