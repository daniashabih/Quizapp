# Fix: GET /api/categories 500 Internal Server Error

## Steps

- [x] 1. Update `api/package.json` — Add all required dependencies
- [x] 2. Update `vercel.json` — Add build configuration with `prisma generate`
- [x] 3. Update `api/index.js` — Improve error logging
- [x] 4. Update `api/_config/prisma.js` — Add better error handling for Prisma client initialization
- [x] 5. Verify changes and test
