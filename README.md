This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/(web)/page.tsx`. The page auto-updates as you edit the file.

## Project structure

One codebase, two modules: the marketing **web** site and the **app** (product).
They share a root layout and nothing else.

```
src/
├─ app/                        Next.js router — URLs only
│  ├─ layout.tsx               shared <html>: fonts, analytics
│  ├─ globals.css              Tailwind + marketing theme
│  ├─ (web)/                   datasentry.in/*        (route group: adds no URL segment)
│  │  ├─ layout.tsx            marketing chrome: cookie banner
│  │  └─ page.tsx, blog/, contact/, podcast/, privacy-policy/, terms-of-service/
│  └─ app/                     datasentry.in/app/*    (noindex, console theme)
│     └─ dpdp-demo/            the clickable DPDP mock
└─ modules/
   ├─ web/components/          marketing components
   └─ app/
      ├─ ui/                   console design system: primitives, brand, console.css
      └─ dpdp/                 the DPDP product
         ├─ components/        shell, sign-in, data map, countdowns, discovery interview
         ├─ types.ts           domain types (kept by the live app)
         ├─ statute.ts         statutory dates (real, not mock)
         ├─ routes.ts          where the mock is mounted
         └─ mock/              illustrative data (replaced by a data layer in the live app)
```

**Shipping the live DPDP app.** Add `src/app/app/dpdp/` alongside `dpdp-demo/`;
it serves `datasentry.in/app/dpdp`, inherits the product layout, and reuses
`@/modules/app/ui` and `@/modules/app/dpdp`, swapping `dpdp/mock` for real
data. The mock keeps running at `/app/dpdp-demo` until it is retired.
`/demo` redirects to `/app/dpdp-demo` (see `next.config.ts`).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
