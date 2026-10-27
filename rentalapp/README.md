# Salone Rent

Rental listings for Sierra Leone. Tenants browse and save properties, then pay a reservation fee (via Monime) to unlock the agent's contact details. Agents manage listings from `/Dashboard`; the super admin manages everything from `/admin`.

Built with Next.js (App Router), Clerk, Prisma (PostgreSQL), Cloudinary, Monime and Resend.

## Setup

```bash
npm install          # also runs `prisma generate`
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL / Prisma Accelerate connection string |
| `NEXT_PUBLIC_CLERK_FRONTEND_API` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `SBM` | Clerk user ID of the super admin |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image and tour uploads |
| `CLOUDINARY_UPLOAD_PRESET` | Optional, defaults to `Property_Image` |
| `MONIME_ACCESS_TOKEN`, `MONIME_SPACE_ID` | Payments |
| `RESERVATION_FEE_NLE` | Reservation fee in Leones, defaults to `50` |
| `RESEND_API_KEY` | Transactional email |
| `ADMIN_EMAIL` | Where contact-form messages go |
| `EMAIL_FROM` | Optional sender, defaults to `Salone Rent <noreply@salonerent.com>` |
| `NEXT_PUBLIC_APP_URL` | Public site URL, used for payment redirects, sitemap and metadata |
| `CRON_SECRET` | Protects `/api/cron/daily`. Vercel sends it automatically for the cron in `vercel.json` |
| `MONIME_WEBHOOK_SECRET` | Optional. If set, the Monime webhook URL must include `?secret=<value>` |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` | Optional SMS/WhatsApp notifications |
| `TWILIO_SMS_FROM`, `TWILIO_WHATSAPP_FROM` | Sender numbers. WhatsApp is tried first, then SMS. Leave both unset to disable texts |

## Roles

- **Agent**: a Clerk user with `publicMetadata.role = "admin"`. Can create, edit and delete only their own properties.
- **Super admin**: the user whose ID is in `SBM`. Can access `/admin`, contact messages and agent applications.

For faster role checks, expose metadata in the Clerk session token (Clerk dashboard → Sessions → Customize session token) with `{"metadata": "{{user.public_metadata}}"}`. Without it, the app falls back to a Clerk API call.

## Payments

1. `POST /api/create-checkout` creates a pending order and a Monime checkout session. The price comes from `RESERVATION_FEE_NLE` on the server.
2. Monime redirects to `/api/payment/return`, which forwards to `/checkout` or `/checkout/cancelled`.
3. `/checkout` asks Monime for the session status. Only a `completed` session marks the order paid, reserves the property and sends the emails, and it only does this once.
4. `POST /api/webhooks/monime` and the daily job do the same check, so orders are confirmed even if the tenant closes the tab after paying.

## Reservation and listing lifecycle

- A paid reservation gives the tenant 3 days of priority. The agent gets a reminder after 2 days, and the property is re-listed after 3 days unless the agent marks it **rented**.
- Listings stay public for 30 days after the agent last confirmed or edited them. Agents get a reminder 5 days before, and can click **Still available** in the dashboard.
- These run in `/api/cron/daily` (`app/lib/jobs.ts`), along with saved-search alert emails.

## Maps

Agents can drop a pin when adding a property. Tenants only ever see an area about 300–600 m from the real spot; the exact address and coordinates are revealed after payment. Tiles come from OpenStreetMap, so no API key is needed.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (Vitest) |
