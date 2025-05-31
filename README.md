# WebMon - Website Uptime + Safe Browsing Monitor

A lightweight Cloudflare Worker that checks website availability and verifies against Google Safe Browsing.

## Features
- Uptime checks via HTTP HEAD requests
- Google Safe Browsing lookup (API v4)
- Scheduled checks via Cloudflare Cron Triggers
- Email alerts via MailChannels
- Tailwind-based dashboard with:
  - Status display
  - Dark mode
  - Filtering and sorting
  - Status history chart (Chart.js)
- Admin UI with password auth:
  - Add/remove URLs
  - Run manual checks
  - CSV export

## Deployment
1. Clone repo:
   ```sh
   git clone https://github.com/yourusername/cloudflare-uptime-monitor
   cd cloudflare-uptime-monitor
   ```
2. Create namespaces:
   ```sh
   wrangler kv:namespace create status_kv
   wrangler kv:namespace create url_kv
   ```
3. Edit `wrangler.toml` with:
   - Your KV IDs
   - Google API key
   - Admin password (as `ADMIN_KEY`)
4. Deploy:
   ```sh
   wrangler deploy
   ```

## Tech Stack
- Cloudflare Workers
- JavaScript
- KV Storage
- Chart.js + Tailwind (CDN)

## Auth
- `/admin/login` to access admin panel
- Sessions expire after 1 hour
- Uses secure HttpOnly cookie
