import { execSync } from 'child_process';

console.log('[migrate] Generating Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit' });

console.log('[migrate] Pushing schema to SQLite database...');
execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

console.log('[migrate] Done. SQLite database is ready at prisma/dev.db');
