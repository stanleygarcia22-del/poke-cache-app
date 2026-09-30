import type {
  PokemonListItem,
  PokemonListResponse,
  PokemonDetail,
  EvolutionChainResponse,
} from '@/types/pokemon';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

// 1. Obtener lista de Pokémon (Mínimo 50 según requerimiento)
export async function getPokemonList(limit = 50, offset = 0): Promise<PokemonListItem[]> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Error al obtener la lista de Pokémon');

  const data: PokemonListResponse = await res.json();

  return data.results.map((item) => {
    const parts = item.url.split('/').filter(Boolean);
    const id = parseInt(parts[parts.length - 1], 10);
    return {
      name: item.name,
      url: item.url,
      id,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });
}

// 2. Obtener detalle completo de un Pokémon por ID o Nombre
export async function getPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error(`Error al obtener detalle del Pokémon ${idOrName}`);
  return res.json();
}

// 3. Obtener Cadena Evolutiva
export async function getPokemonEvolutionChain(speciesUrl: string): Promise<string[]> {
  try {
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();

    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData: EvolutionChainResponse = await evoRes.json();

    const names: string[] = [];
    let current = evoData.chain;

    while (current) {
      names.push(current.species.name);
      current = current.evolves_to[0];
    }

    return names;
  } catch (error) {
    return [];
  }
}