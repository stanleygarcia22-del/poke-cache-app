// Estructura de la lista principal
export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  image: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

// Estructura detallada para la página /pokemon/[id]
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  species: {
    url: string;
  };
}

// Cadena Evolutiva
export interface ChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: ChainLink[];
}

export interface EvolutionChainResponse {
  chain: ChainLink;
}