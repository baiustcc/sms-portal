# BAIUST Computer Club SMS Portal

## Quick Start

```bash
npm install
npm run dev
```

## Environment

Create a `.env` file:

```
SMS_API_KEY="your-bulksmsbd-api-key"
SMS_SENDER_ID="your-sender-id"
DEFAULT_SMS_FOOTER="- BAIUST Computer Club"
AUTH_ALLOWED_NUMBERS="017XXXXXXXX,018YYYYYYYY"
AUTH_NOTIFICATION_NUMBERS="017XXXXXXXX,018YYYYYYYY" # optional, defaults to allowed list
AUTH_SESSION_SECRET="super-strong-random-secret"
```

## Features

- OTP-protected dashboard (per phone numbers listed in `AUTH_ALLOWED_NUMBERS`)
- Single send with preview and footer override
- Bulk send via Excel upload (`number` column required)
- Handlebars templating with conditionals
- shadcn/ui dashboard layout

## Notes

- API keys and auth settings are loaded from environment variables.
- OTP SMS alerts include the requester IP, user agent, and timestamp for auditing.
- Bulk SMS and Single SMS call `bulksmsbd.net` per provided guide (JSON).
