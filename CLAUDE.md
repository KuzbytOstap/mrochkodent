# MrochkoDent

Сайт стоматології з онлайн-записом, CRM для персоналу та CMS для контенту.
pnpm workspace: `apps/web` (Next.js) і `apps/api` (NestJS). Команди запуску в `README.md`, продуктові правила запису в `docs/mvp.md`.

## Межі застосунків

**`apps/web` (Next.js App Router)** відповідає за публічний сайт та адмінку: сторінки, UI, форми, рендеринг.

- Дані отримує і змінює тільки через REST API `apps/api`.
- Не підключається до БД і не імпортує Prisma.
- Не містить бізнес-правил (статуси записів, перевірка перетинів, розклад). Валідація у формах лише для зручності, остаточну робить API.

**`apps/api` (NestJS)** володіє бізнес-логікою і доступом до БД.

- Єдине місце, де живуть Prisma schema, міграції та запити до PostgreSQL.
- Кожен endpoint описаний у Swagger (`/docs`). Контракт між застосунками це OpenAPI, спільного коду між ними поки немає.
- Доступ до БД лише через `PrismaService` (`src/prisma`).

Якщо незрозуміло, куди покласти логіку: правило про дані чи запис іде в API, відображення іде у web.

## Команди

```bash
pnpm db:up && pnpm dev                       # локальний запуск
pnpm lint && pnpm typecheck && pnpm test && pnpm build   # перевірки перед завершенням задачі
pnpm --filter api prisma:migrate             # після зміни prisma/schema.prisma
```

## Що варто знати

- Версії фреймворків новіші за звичні (Next.js 16, NestJS 12, Prisma 7). Перед кодом прочитай `apps/web/AGENTS.md` і `apps/api/AGENTS.md`, там посилання на актуальну документацію.
- `apps/api` це ESM: відносні імпорти закінчуються на `.js`, замість `__dirname` використовуй `import.meta.dirname`. Тести на Vitest (`vi.fn()`), лінтер oxlint.
- Prisma Client генерується у `apps/api/src/generated/prisma` (не в git) під час `pnpm install` або `pnpm --filter api prisma:generate`. URL бази задається в `apps/api/prisma.config.ts`, а не в `schema.prisma`.
- Один `.env` у корені репозиторію: його читають Docker Compose, Prisma CLI та API. Нові змінні додавай і в `.env.example`.
- API не підключається до БД під час старту. Так він запускається без бази, а `/health` відповідає 503. Не додавай `$connect()` у `onModuleInit`.
- Версія TypeScript 6.0: TypeScript 7 ще не підтримують typescript-eslint і `@nestjs/swagger`.
- Час зберігаємо в UTC, показуємо в `Europe/Kyiv`.
