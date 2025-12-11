# MySQL Database Setup

## Connection String Format

Set the `DATABASE_URL` environment variable:

```bash
export DATABASE_URL="mysql://root:111111@localhost:3306/automanager"
```

Or create a `.env` file:
```
DATABASE_URL=mysql://root:111111@localhost:3306/automanager
```

## Database Setup

1. Create the database:
```sql
CREATE DATABASE automanager;
```

2. Run migrations:
```bash
npm run db:push
```

## Current Status

The codebase has been converted from PostgreSQL to MySQL, but there are some remaining TypeScript errors that need to be fixed:

1. MySQL enum syntax differs from PostgreSQL
2. Some type issues with insert operations
3. Need to verify all `.returning()` calls have been replaced

