# ⚡ PokéCache - TanStack Query v5 & React Server Components

Aplicación web desarrollada con **Next.js 16+**, **TypeScript**, **Tailwind CSS** y **TanStack Query v5** para demostrar técnicas avanzadas de hidratación, prefetching en hover y gestión eficiente de caché.

## 🚀 Repositorio
- **Repositorio:** [https://github.com/stanleygarcia22-del/poke-cache-app](https://github.com/stanleygarcia22-del/poke-cache-app)

## 🎯 Estrategia de Caché y Rendimiento

### 1. Servidor al Cliente (`HydrationBoundary`)
- Los 50 Pokémon iniciales se obtienen en el servidor mediante un **React Server Component** (`src/app/page.tsx`).
- Se utiliza `dehydrate` junto con `<HydrationBoundary>` para transferir la caché inicial sin realizar peticiones redundantes en el navegador durante la primera carga.

### 2. Prefetching Estratégico en Hover (`onMouseEnter`)
- En el componente client-side `PokemonCard.tsx`, el evento `onMouseEnter` dispara `queryClient.prefetchQuery`.
- Cuando el usuario pasa el cursor sobre la tarjeta de un Pokémon, sus detalles (estadísticas, habilidades, tipos e imágenes) se descargan de fondo en cuestión de milisegundos.
- Al hacer clic, la vista dinámica `/pokemon/[id]` muestra la información de forma **instantánea** desde la memoria caché.

### 3. Configuración de Tiempos de Caché
- **`staleTime: 24 * 60 * 60 * 1000` (24 Horas):** Se define que la información cargada mantendrá su estado "fresco" durante 24 horas, evitando re-peticiones innecesarias a la PokéAPI.
- **`gcTime: 24 * 60 * 60 * 1000` (24 Horas):** Mantiene los datos en la memoria de recolector de basura por 24 horas para garantizar navegación fluida sin perder el estado durante la sesión del usuario.

## 🛠️ Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/stanleygarcia22-del/poke-cache-app.git](https://github.com/stanleygarcia22-del/poke-cache-app.git)
   cd poke-cache-app

- Instalar dependencias: npm install

- Ejecutar el servidor de desarrollo: npm run dev -- -h localhost