# Zarynx.com

Free gaming tools website — PC bottleneck calculator, sensitivity converters, build planners and more.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS variables
- **Icons**: Lucide React
- **SEO**: next-seo + next-sitemap
- **Hosting**: Vercel
- **Domain**: zarynx.com

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── layout.tsx     # Root layout (navbar + footer)
│   ├── page.tsx       # Homepage
│   └── not-found.tsx  # 404 page
├── components/
│   ├── layout/        # Navbar, Footer
│   └── sections/      # Homepage sections
├── data/
│   └── tools.ts       # All 22 tools — single source of truth
├── lib/
│   ├── config.ts      # Site config, nav links, SEO
│   └── utils.ts       # Helper functions
└── styles/
    └── globals.css    # Design tokens + global styles
```

## Changing Content

- **Tool data**: Edit `src/data/tools.ts`
- **Site name / SEO**: Edit `src/lib/config.ts`
- **Colors**: Edit CSS variables in `src/styles/globals.css`
- **Nav links**: Edit `navLinks` in `src/lib/config.ts`

## Deployment

Push to GitHub → Vercel auto-deploys on every push to `main`.

Add your domain in Vercel dashboard → Domains → zarynx.com
