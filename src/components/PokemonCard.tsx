'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { getPokemonDetail } from '@/services/pokemon';
import type { PokemonListItem } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const queryClient = useQueryClient();

  // Requisito b.1 y b.3: Disparar prefetchQuery en onMouseEnter
  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['pokemon', pokemon.id],
      queryFn: () => getPokemonDetail(pokemon.id),
      staleTime: 24 * 60 * 60 * 1000, // 24 horas de vigencia en caché
    });
  };

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      onMouseEnter={handlePrefetch}
      className="group bg-slate-900/80 border border-slate-800 hover:border-red-500/50 rounded-2xl p-5 flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/10"
    >
      <div className="w-full flex justify-end">
        <span className="text-xs font-mono text-slate-500 font-bold group-hover:text-red-400 transition-colors">
          #{pokemon.id.toString().padStart(3, '0')}
        </span>
      </div>

      <div className="relative w-32 h-32 my-3 transition-transform duration-300 group-hover:scale-110">
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          fill
          sizes="128px"
          priority={pokemon.id <= 10}
          className="object-contain drop-shadow-md"
        />
      </div>

      <h3 className="capitalize font-bold text-white text-lg group-hover:text-red-400 transition-colors">
        {pokemon.name}
      </h3>
    </Link>
  );
}