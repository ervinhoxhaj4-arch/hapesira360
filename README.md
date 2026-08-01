# Hapësira360 — Production Starter

Next.js production starter for hapesira360.com.

## Included
- Albanian public homepage
- Search/results page
- Dynamic property pages
- Private `/h360-admin` login route
- Protected demo dashboard and add-property page
- Optional 360° tour link
- Google Maps coordinate links
- Supabase-ready database schema
- SEO sitemap and robots rules hiding admin routes

## Run locally
```bash
npm install
npm run dev
```
Then open http://localhost:3000.

## Connect Supabase
1. Create a Supabase project.
2. Run `supabase-schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local` and add your project credentials.
4. Replace demo data access in `lib/demo-data.ts` with Supabase queries.

The current admin gate is a UI demo using sessionStorage. Before launch, replace it with Supabase Auth and server-side route protection.
