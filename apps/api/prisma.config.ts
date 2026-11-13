import { resolve } from 'node:path';
import { defineConfig } from 'prisma/config';

// Змінні оточення живуть у .env у корені репозиторію. Якщо файлу немає
// (наприклад, у CI), беремо значення з оточення процесу.
try {
  process.loadEnvFile(resolve(import.meta.dirname, '../../.env'));
} catch {
  // .env не обов'язковий
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // `prisma generate` не потребує з'єднання, тому порожнє значення допустиме.
    url: process.env.DATABASE_URL ?? '',
  },
});
