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
```

## Features

- Public dashboard with no authentication
- Single send with preview and footer override
- Bulk send via Excel upload (`number` column required)
- Handlebars templating with conditionals
- shadcn/ui dashboard layout

## Notes

- API keys are loaded from env. Protect the deployment URL via network controls if you need to limit who can send SMS.
- Bulk SMS and Single SMS call `bulksmsbd.net` per provided guide (JSON).
