# Stitcher Project Context 🧵

This file serves as the technical memory and architectural context for the **Stitcher** project. It is intended to be read by AI coding assistants (like Gemini, GitHub Copilot, Cursor, etc.) and developers joining the project to instantly understand the system architecture, stack, and business logic.

## 🛠 Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI (Lucide Icons)
- **Database:** Neon Serverless PostgreSQL
- **ORM:** Prisma (using `@prisma/adapter-pg` edge driver)
- **Authentication:** NextAuth.js (v5 / authjs) with Credentials provider (bcryptjs hashing)
- **File Storage:** UploadThing (for fabric catalog images)
- **Notifications:** Telegram Bot API (for instant order alerts)
- **Deployment:** Vercel (Edge Network)

---

## 🗄️ Database Schema & Models
The Prisma schema (`prisma/schema.prisma`) revolves around three core models:

1. **User**
   - Fields: `id`, `name`, `email`, `password`, `role`, `createdAt`
   - Roles: `ADMIN` (Dashboard access) | `CLIENT` (Standard ordering)
2. **Dress (Catalog Item)**
   - Fields: `id`, `name`, `pricePerMeter`, `stockMeters`, `imageUrl`, `description`
   - Represents the raw fabric available for purchase.
3. **Order**
   - Fields: `id`, `userId`, `dressId`, `orderedMeters`, `totalPrice`, `status`, `shippingAddress`, `contactNumber`
   - Relations: Belongs to `User`, references `Dress`.

### 🔄 Order Pipeline State Machine
Orders follow a strict linear progression defined by the `OrderStatus` enum:
1. `PENDING` - Client submits order (Stock is reserved).
2. `APPROVED` - Admin verifies payment/stock and approves.
3. `IN_TRANSIT` - Fabric has been shipped.
4. `DELIVERED` - Client has received the fabric.
*(Optional `REJECTED` state exists if the admin cancels the order).*

---

## 🔑 Environment Variables Structure
To run this project, the following `.env` is strictly required:
```env
# Database connection directly to Neon Postgres
DATABASE_URL="postgresql://<user>:<pass>@<host>/<db>"

# NextAuth configuration
AUTH_SECRET="base64-secret"
AUTH_URL="https://stitcher-inky.vercel.app" # Required in production

# UploadThing for Image Hosting
UPLOADTHING_TOKEN="uploadthing-secret-token"

# Telegram Bot
TELEGRAM_BOT_TOKEN="bot-token"
TELEGRAM_CHAT_ID="admin-chat-id"
```

---

## ⚠️ Known Technical Gotchas & Decisions

1. **Prisma Edge Adapter & SSL:** 
   Because the project is hosted on Vercel, it uses the `@prisma/adapter-pg` driver. Neon's connection string usually includes `?sslmode=require`. **However**, the `adapter-pg` throws `URL_PARAM_NOT_SUPPORTED` if query parameters are left in the `DATABASE_URL`. 
   *Solution:* We strip query parameters dynamically in `src/lib/prisma.ts` and pass `{ ssl: { rejectUnauthorized: false } }` to the `pg` Pool directly.
   
2. **NextAuth Cookies & Callbacks:**
   The `AUTH_URL` environment variable MUST exactly match the Vercel production domain (`https://stitcher-inky.vercel.app`). Otherwise, the NextAuth JWT cookies will be rejected cross-domain or the callback URL will mismatch.
   
3. **Foreign Key Constraints (Data Integrity):**
   Orders *must* be linked to a valid `userId`. During the migration from SQLite to Postgres, we wrote strict migration scripts to ensure Users were synced before Orders to satisfy PostgreSQL's strict Foreign Key rules.
   
4. **Desktop Navigation Bug:**
   Tailwind's `scroll-behavior` was not registering on desktop anchor links. Fixed by explicitly adding `scroll-smooth` to the `<html>` tag in `src/app/layout.tsx`.

---

## 🚀 Key Workflows

- **Telegram Notifications:**
  When a client creates an order via the Server Action (`createOrder` in `src/app/actions/order.ts`), the system simultaneously deducts `stockMeters` from the `Dress` model and triggers a `fetch` request to the Telegram Bot API to notify the admin immediately.
  
- **Admin Dashboard:**
  Protected by NextAuth middleware and role-checking in `layout.tsx`. Only users with `role === "ADMIN"` can view `/admin` routes. The dashboard provides aggregated sales metrics and direct mutation access to Orders and Inventory.

## 👥 Test Credentials
- Admin: `admin@stitcher.com` / `admin123`
- Client: `client@stitcher.com` / `client123`
