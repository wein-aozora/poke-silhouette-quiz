export interface Pokemon {
  id: number
  nameEn: string
  nameJa: string
  spriteUrl: string
}

export interface QuizData {
  answer: Pokemon
  choices: Pokemon[]
}

const TOTAL_POKEMON = 1025

async function fetchPokemon(id: number): Promise<Pokemon> {
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

function uniqueRandomIds(count: number, max: number): number[] {
  const ids = new Set<number>()
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * max) + 1)
  }
  return [...ids]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function getQuizData(): Promise<QuizData> {
  const ids = uniqueRandomIds(3, TOTAL_POKEMON)
  const pokemons = await Promise.all(ids.map(fetchPokemon))
  return { answer: pokemons[0], choices: shuffle(pokemons) }
}
