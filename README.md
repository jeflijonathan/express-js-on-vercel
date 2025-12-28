# Backend README
## Runtime path alias configuration

This project uses TypeScript path aliases configured in `tsconfig.json` (for example, `@domains/*`). To make Node.js and `ts-node-dev` resolve those aliases at runtime, we use `tsconfig-paths`.

- Dev: The `dev` script in `package.json` now uses the following command:

```
ts-node-dev --respawn --transpile-only -r dotenv/config -r tsconfig-paths/register src/index.ts
```

- Production / Start: The `start` script now requires `tsconfig-paths/register` so Node resolves the aliases when running compiled JS:

```
node -r dotenv/config -r tsconfig-paths/register dist/index.js

You can also verify your `DATABASE_URL` with npm script:

```

npm run check-env

```

```

If you prefer a different setup for deploying, consider converting aliases to relative paths during build or using a runtime aliasing library such as `module-alias`.

## Database connection troubleshooting

If you see: "pool timeout: failed to retrieve a connection from pool after <ms> (pool connections: active=0 idle=0 limit=5)", the issue is often the database cannot give a connection because:

- the DB is not running or unreachable
- the DB has reached its `max_connections` limit
- the Prisma client pool is small or all connections are blocked

Fixes and checks:

1. Verify your DB is running and accessible from your dev machine. Use the MySQL client (or relevant DB CLI) to connect.
2. Increase the Prisma client pool size by setting `DB_CONNECTION_LIMIT` in your `.env` or adding `connection_limit` to your connection string. For example:

```
DB_CONNECTION_LIMIT=10
# OR for a URL style (if you build your DATABASE_URL):
DATABASE_URL="mysql://username:password@host:3306/db?connection_limit=10"
```

3. Check your MySQL `max_connections` setting and increase if needed.
4. Try a raw SQL connection test with Prisma to confirm connectivity and if the DB can return a connection:

```powershell
node -r dotenv/config -e "const { PrismaClient } = require('@prisma/client'); const client = new PrismaClient(); client.$connect().then(()=> client.$queryRaw`select 1`).then(console.log).finally(()=>client.$disconnect())"
```

5. Ensure the code uses a single Prisma client instance and disconnects on app shutdown.

6. migartion
```
1. add migration: npx prisma migrate dev 
2. npx prisma migrate dev --name nama_migrasi
3. npx prisma migrate dev --create-only nama_migrasi
4. generate client: npx prisma generate
```
```
Descriptions:
This is your Prisma schema file,
learn more about it in the docs: https://pris.ly/d/prisma-schema

Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
Try Prisma Accelerate: https://pris.ly/cli/accelerate-init
```