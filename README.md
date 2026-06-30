# Stitcher Fashion

A premium fashion catalog and ordering platform built with Next.js, Prisma, NextAuth, and Neon PostgreSQL.

🌍 **Live Production Link:** [https://stitcher-inky.vercel.app](https://stitcher-inky.vercel.app)
🤖 **Telegram Order Bot:** [https://t.me/stitcherorderbot](https://t.me/stitcherorderbot)

## Features
- Real-time catalog and inventory tracking
- Secure ordering pipeline (Pending -> Approved -> In Transit -> Delivered)
- Secure image uploads via UploadThing
- Automated Telegram notifications for new orders
- Admin dashboard for sales analytics and stock management

## Test Accounts

If you are exploring the application, you can use the following test accounts:

**Admin Account** (Has access to the Admin Dashboard to manage catalogs, inventory, and orders)
- **Email:** `admin@stitcher.com`
- **Password:** `admin123`

**Client Account** (Standard user account to view orders)
- **Email:** `client@stitcher.com`
- **Password:** `client123`

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up your `.env` file based on the required secrets.

3. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
