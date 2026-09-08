# Daily Diet Companion

Aplicação web para registrar e acompanhar refeições, marcando se estão dentro ou fora da dieta, com estatísticas de adesão (percentual na dieta, melhor sequência, totais).

## Tecnologias

- **Vite** + **React 18** + **TypeScript**
- **shadcn/ui** (Radix UI) + **Tailwind CSS**
- **React Router** v6, **TanStack Query**, **Framer Motion**
- **react-hook-form** + **zod** (formulários)
- **Vitest** + Testing Library (testes)

## Backend

O frontend consome uma API REST externa (deploy no Render). Endpoints utilizados:

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/refeicoes` | Lista todas as refeições |
| GET | `/refeicoes/<id>` | Detalhe de uma refeição |
| POST | `/refeicoes` | Registra uma refeição |
| PUT | `/refeicoes/<id>` | Edita uma refeição |
| DELETE | `/refeicoes/<id>` | Exclui uma refeição |

Contrato da API (snake_case):

```json
{
  "id": 1,
  "name": "Omelete de Espinafre",
  "description": "Omelete com espinafre e queijo branco",
  "date_time": "2025-03-03 08:00:00",
  "in_diet": true
}
```

A conversão para os tipos do frontend (`Meal`/`MealFormData`) é feita em `src/lib/api.ts`.

## Configuração

Copie `.env.example` para `.env` e ajuste a URL da API:

```sh
cp .env.example .env
```

```env
VITE_API_URL=https://sua-api.com
```

- **Desenvolvimento**: o app chama `/api`, que o dev server do Vite faz proxy para `VITE_API_URL` — evita problemas de CORS.
- **Produção**: o app chama `VITE_API_URL` diretamente — a API precisa ter CORS habilitado.

## Como rodar

```sh
npm install
npm run dev
```

O app sobe em `http://localhost:8080`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server com HMR |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run test` | Testes (Vitest) |
| `npm run lint` | ESLint |

## Estrutura

```
src/
├── components/     # Componentes da UI (Header, MealCard, dialogs, ui/)
├── hooks/          # useMeals (estado + chamadas à API)
├── lib/            # api.ts (cliente HTTP + mapeamento de tipos)
├── pages/          # Index, NotFound
├── types/          # Meal, MealFormData, DietStats
└── test/           # Testes
```
