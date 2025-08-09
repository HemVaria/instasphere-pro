# Instasphere (Fork)

A modern social app built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui — backed by Supabase (Auth, Postgres, Storage). Includes a real‑time-ish feed, channels, notifications, and image uploads for posts.

## Features

- Feed with text and image posts (upload via Supabase Storage)
- Create, like, and interact with posts
- Channels and notifications UI
- Explore and Settings pages
- Authentication with Supabase, plus a resilient demo mode when auth is unreachable (preview/offline)
- Fully responsive UI built with Tailwind CSS and shadcn/ui
- Accessible components and sensible defaults

## Tech Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS, shadcn/ui, Lucide icons
- Supabase (Auth, Postgres, Storage)
- Deployed on Vercel (automatic Next.js detection) \[^1]

---

## Quick Start

### 1) Prerequisites

- Node.js 18+ (or 20+ recommended)
- pnpm (recommended) or npm/yarn
- A Supabase project (for Auth, DB, and Storage)

### 2) Clone and install

\`\`\`bash
git clone https://github.com/your-org/instasphere-pro.git
cd instasphere-pro
pnpm install
\`\`\`

### 3) Environment variables

Add these to your Vercel Project Settings or a local \`.env.local\` during local development:

\`\`\`bash
# Public (safe in client)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Server-only
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret

# Optional Postgres (if using direct Postgres access)
POSTGRES_URL=...
POSTGRES_PRISMA_URL=...
POSTGRES_URL_NON_POOLING=...
POSTGRES_HOST=...
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...
\`\`\`

Notes:
- Values for Supabase can be found in your Supabase dashboard (Project Settings → API).
- In Vercel, server-only keys remain secure by default; do not prefix them with \`NEXT_PUBLIC_\`.

### 4) Database setup

The \`/scripts\` folder contains SQL you can run in the Supabase SQL editor or via \`psql\`. Recommended order:

1. \`scripts/01-setup-database-fixed.sql\`
2. \`scripts/02-insert-default-data.sql\`
3. \`scripts/03-create-posts-schema.sql\`
4. \`scripts/04-run-posts-migration.sql\`
5. \`scripts/05-add-post-image.sql\` (adds \`image_url\` support for posts)
6. If your project uses channels/notifications, also run:
   - \`scripts/create-channels-table.sql\`
   - \`scripts/create-notifications-table.sql\`
   - \`scripts/fix-channels-schema.sql\` (if needed)

Example using \`psql\`:

\`\`\`bash
psql "$SUPABASE_DB_CONNECTION_STRING" -f scripts/01-setup-database-fixed.sql
psql "$SUPABASE_DB_CONNECTION_STRING" -f scripts/02-insert-default-data.sql
...
\`\`\`

### 5) Storage (image uploads)

- Create a public bucket named \`post-images\` in Supabase Storage.
- Public access policy: allow read for \`anon\` role. You can keep write restricted to service role or authenticated users.
- The project includes an API route (\`app/api/upload-image/route.ts\`) that accepts \`multipart/form-data\` with a \`file\` field and stores images in \`post-images\`. It returns the public URL for attaching to posts.

Supported formats: JPG, PNG, WEBP, GIF (configure limits in the route if needed).

### 6) Run the app

\`\`\`bash
pnpm dev
# then open http://localhost:3000
\`\`\`

---

## Usage

- Sign in (Supabase). In preview/offline scenarios, the app falls back to a local demo user so you can continue using the app. See “Demo Mode” below.
- Create a post from the Feed:
  - Enter text
  - Optionally pick an image
  - Submit — the image is uploaded and its URL is stored on the post
- Explore other sections: Channels, Notifications, Explore, Settings

---

## Demo Mode (Preview/Offline resilience)

If Supabase Auth can’t be reached (e.g., local preview without network), the app will:
- Restore a previously saved demo user from \`localStorage\`, or create a new demo user
- Persist the demo user in \`localStorage\` so sessions survive reloads
- Keep production behavior unchanged when Supabase is reachable

Disable demo mode by clearing the demo user key in your browser storage or by signing out once connectivity is restored.

---

## Project Structure (high level)

\`\`\`text
app/
  api/upload-image/route.ts   # server route for image uploads
  layout.tsx, page.tsx
components/
  feed/                       # feed UI + create post modal
  slidezone/                  # chat-like UI pieces
  ui/                         # shared UI (shadcn-based)
hooks/                        # app hooks (auth, posts, chat, etc.)
lib/supabase/                 # client/server/admin helpers
scripts/                      # SQL migrations and seed data
public/                       # static assets
\`\`\`

---

## Deploying to Vercel

1) Push your code to Git (GitHub, GitLab, Bitbucket).  
2) Import the project into Vercel. Vercel automatically detects Next.js. \[^1]  
3) Add your environment variables in Vercel Project Settings.  
4) Deploy.

After the first deploy:
- Confirm the \`post-images\` bucket exists and is public-read in Supabase.
- Test creating posts with images in production.

---

## Scripts

\`\`\`bash
# Dev
pnpm dev

# Build & start
pnpm build
pnpm start

# Lint & format (add Prettier/ESLint configs if needed)
pnpm lint
\`\`\`

---

## Troubleshooting

- “Connected successfully!” banner does not disappear:
  - Hard reload the page (Cmd/Ctrl + Shift + R) to clear a stale client bundle.
  - If developing, ensure the connection-status auto-hide timer effect is present and not being cleared prematurely.

- Image upload fails:
  - Check that \`SUPABASE_SERVICE_ROLE_KEY\` is set on the server (Vercel) if your route requires it.
  - Ensure the \`post-images\` bucket exists and is public-read for GET.
  - Verify the file type and max size configured in the route handler.

- Auth errors in preview:
  - Demo mode should kick in automatically when Supabase is unreachable. Clear storage to reset.

---

## Roadmap

- Post comments and threads
- Reactions and mentions
- Rich text editor for posts
- Infinite scrolling and optimistic updates

---

## Contributing

1. Fork the repo
2. Create a feature branch: \`git checkout -b feat/awesome\`
3. Commit changes: \`git commit -m "feat: add awesome"\`
4. Push: \`git push origin feat/awesome\`
5. Open a PR

---

## License

MIT — see \`LICENSE\`. You can change to your preferred license if needed.

---

## Acknowledgements

- shadcn/ui
- Supabase
- Vercel
- Lucide Icons
- Built and iterated with v0.dev

---

### References

- Vercel automatically detects Next.js projects on import and configures defaults; deploying via Git is the recommended workflow. \[^1]

\[^1]: https://vercel.com/docs/integrations/cms/contentful
