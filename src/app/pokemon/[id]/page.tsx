'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getPokemonDetail, getPokemonEvolutionChain } from '@/services/pokemon';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PokemonDetailPage({ params }: PageProps) {
  const { id } = use(params);

  // Requisito d.3: Los datos se consumen de la caché de forma instantánea si fueron prefetched
  const {
    data: pokemon,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['pokemon', Number(id)],
    queryFn: () => getPokemonDetail(id),
    staleTime: 24 * 60 * 60 * 1000,
  });

  // Query secundaria para obtener la cadena evolutiva usando la URL de especie
  const { data: evolutions } = useQuery({
    queryKey: ['pokemon-evolutions', pokemon?.species.url],
    queryFn: () => getPokemonEvolutionChain(pokemon!.species.url),
    enabled: !!pokemon?.species.url,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error al cargar el Pokémon</h2>
        <Link href="/" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm">
          ← Volver a la Pokédex
        </Link>
      </div>
    );
  }

  const mainImage =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-red-400 mb-8 transition-colors"
      >
        ← Volver a la Pokédex
      </Link>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Imagen e Identificación */}
          <div className="flex flex-col items-center bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
            <span className="text-sm font-mono text-slate-500 font-bold self-start">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
            <div className="relative w-56 h-56 my-4">
              <Image
                src={mainImage}
                alt={pokemon.name}
                fill
                sizes="224px"
                priority
                className="object-contain drop-shadow-xl"
              />
            </div>
            <h1 className="text-3xl font-extrabold text-white capitalize">{pokemon.name}</h1>

            {/* Tipos */}
            <div className="flex gap-2 mt-4">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className="bg-red-950/80 text-red-400 border border-red-800/50 text-xs font-semibold px-3 py-1 rounded-full capitalize"
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Estadísticas y Habilidades */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2 mb-3">
                Estadísticas Base
              </h2>
              <div className="space-y-2">
                {pokemon.stats.map((s) => (
                  <div key={s.stat.name} className="flex items-center text-xs">
                    <span className="w-28 text-slate-400 uppercase font-semibold">
                      {s.stat.name.replace('-', ' ')}
                    </span>
                    <span className="w-8 font-bold text-white text-right mr-3">
                      {s.base_stat}
                    </span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (s.base_stat / 150) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2 mb-3">
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((a) => (
                  <span
                    key={a.ability.name}
                    className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-lg capitalize border border-slate-700"
                  >
                    {a.ability.name.replace('-', ' ')} {a.is_hidden && '(Oculta)'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cadena Evolutiva */}
        {evolutions && evolutions.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4">Línea Evolutiva</h2>
            <div className="flex flex-wrap items-center gap-3">
              {evolutions.map((evoName, index) => (
                <div key={evoName} className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-xl text-sm capitalize font-bold ${
                      evoName === pokemon.name
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {evoName}
                  </span>
                  {index < evolutions.length - 1 && (
                    <span className="text-slate-600 text-sm">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}