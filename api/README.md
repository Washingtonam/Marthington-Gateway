Flutterwave webhook (Vercel)

This folder contains a simple Vercel-compatible serverless function `flutterwave-webhook.js` that verifies Flutterwave webhook signatures and logs incoming events.

Environment
- `FLUTTERWAVE_SECRET` — set this to your Flutterwave webhook secret (from your Flutterwave dashboard).

Deploying
1. Ensure this repo is deployed on Vercel.
2. Set the `FLUTTERWAVE_SECRET` environment variable in your Vercel project settings.
3. In Flutterwave Dashboard → Settings → Webhooks, add:
   - URL: `https://<your-domain>/api/flutterwave-webhook`
   - Method: `POST`

Notes
- The function persists events to `.webhook_events/flutterwave-events.json` (useful for debugging). On serverless platforms this storage is ephemeral — for production you should persist to a database.
- Replace the placeholder logic (logging) with your backend action to mark requests paid and trigger your app workflows.
