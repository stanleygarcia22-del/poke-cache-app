import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import { getPokemonList } from '@/services/pokemon';
import { PokemonCard } from '@/components/PokemonCard';

export const revalidate = 86400; // 24 horas

export default async function HomePage() {
  const queryClient = getQueryClient();

  // Requisito a.2: Obtener al menos 50 Pokémon desde el servidor
  await queryClient.prefetchQuery({
    queryKey: ['pokemon-list', 50, 0],
    queryFn: () => getPokemonList(50, 0),
  });

  const pokemons = await getPokemonList(50, 0);

  return (
    // Requisito c.1 y c.2: Transferir datos deshidratados del servidor al cliente
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="text-center mb-12">
          <span className="bg-red-950 text-red-400 border border-red-800/60 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-widest inline-block mb-3">
            PokéAPI + TanStack Query v5
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Pokédex con <span className="text-red-500">Caché Avanzado</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Pasa el cursor sobre cualquier tarjeta para precargar instantáneamente la información en caché mediante <code className="text-red-400 font-mono">prefetchQuery</code>.
          </p>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </section>
      </main>
    </HydrationBoundary>
  );
}