# Modern Relic (Standalone)

## Custom Tumbler Upload + Submission Setup

This project now supports artwork uploads for the custom tumbler flow using:

- Vercel Blob (file storage)
- Neon Postgres (submission records)
- Next.js App Router route handlers

### 1) Environment variables

Copy `.env.example` to `.env.local` and set:

- `BLOB_READ_WRITE_TOKEN` - Vercel Blob read/write token
- `DATABASE_URL` - Neon Postgres connection string
- `NEXT_PUBLIC_SQUARE_CHECKOUT_URL` - Square checkout URL

### 2) Create database table

Run the SQL migration in your Neon database:

`db/migrations/001_create_custom_tumbler_submissions.sql`

### 3) Install dependencies

```bash
npm install
```

### 4) Run locally

```bash
npm run dev
```

## Submission flow

1. Customer uploads artwork from `/shop/custom-tumbler`
2. Files are validated and uploaded to Vercel Blob
3. Submission is saved in Postgres with reference format `MR-YYMMDD-XXXXXX`
4. Customer is redirected to:
   `/shop/custom-tumbler/confirmation?reference=REFERENCE`
5. Confirmation page shows checkout button and reference guidance
