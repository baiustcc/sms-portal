# BAIUST Computer Club SMS Portal

## Quick Start

```bash
npm install
npm run dev
```

If this is a fresh database:

- Visit `/setup` to create the first admin user.

## Environment

Create a `.env` file:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-strong-secret"
NEXTAUTH_URL="http://localhost:3000"
SMS_API_KEY="your-bulksmsbd-api-key"
SMS_SENDER_ID="your-sender-id"
DEFAULT_SMS_FOOTER="- BAIUST Computer Club"
```

## Features

- Admin-only user creation
- Single send with preview and footer override
- Bulk send via Excel upload (`number` column required)
- Handlebars templating with conditionals
- shadcn/ui dashboard layout

## Notes

- API keys are loaded from env.
- Bulk SMS and Single SMS call `bulksmsbd.net` per provided guide (JSON).
