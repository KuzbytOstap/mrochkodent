# MrochkoDent

Сайт стоматології з онлайн-записом, CRM для персоналу та CMS для контенту.
Зараз у репозиторії лише локальний фундамент: каркас застосунків, PostgreSQL і `GET /health`.

- `apps/web`: Next.js (App Router, TypeScript, Tailwind), публічний сайт та адмінка.
- `apps/api`: NestJS (REST, Swagger, Prisma), бізнес-логіка і доступ до БД.
- `docs/mvp.md`: правила майбутнього запису та відкриті рішення.

## Вимоги

Node.js 22.12+, pnpm 10, Docker з Compose.

## Запуск

```bash
cp .env.example .env   # один .env у корені для Docker Compose та API
pnpm install           # також генерує Prisma Client
pnpm db:up             # PostgreSQL у Docker, чекає на healthy
pnpm dev               # web і API у режимі watch
```

| Що | Адреса |
| --- | --- |
| Сайт | http://localhost:3000 |
| API | http://localhost:4000 |
| Swagger UI | http://localhost:4000/docs |
| OpenAPI JSON | http://localhost:4000/docs-json |
| Health | http://localhost:4000/health |

`GET /health` повертає `200 {"status":"ok","database":"up"}`, а коли БД недоступна, `503 {"status":"error","database":"down"}`.

Якщо порт 3000 зайнятий, Next.js сам візьме наступний вільний. Порт API задає `API_PORT`, порт БД задає `POSTGRES_PORT` (тоді онови і `DATABASE_URL`).

## Перевірки

```bash
pnpm lint        # oxlint (api), eslint (web)
pnpm typecheck
pnpm test        # vitest (api), БД не потрібна
pnpm build
```

## Інше

```bash
pnpm db:down                        # зупинити БД, дані лишаються у volume
docker compose down -v              # зупинити БД і видалити дані
pnpm --filter api prisma:migrate    # створити і застосувати міграцію (коли з'являться моделі)
pnpm --filter api start             # запустити зібраний API
pnpm --filter web start             # запустити зібраний сайт
```
