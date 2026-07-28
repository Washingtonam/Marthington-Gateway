import { createHmac } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const secret = process.env.FLUTTERWAVE_SECRET;
  if (!secret) {
    console.error('[webhook] missing FLUTTERWAVE_SECRET');
    res.status(500).send('Server misconfigured');
    return;
  }

  try {
    const raw = await getRawBody(req);
    const signature = req.headers['verif-hash'] || req.headers['verificationhash'] || req.headers['x-flutterwave-signature'];

    const hmac = createHmac('sha256', secret).update(raw).digest('hex');

    if (!signature || signature !== hmac) {
      console.warn('[webhook] signature mismatch', { signature, expected: hmac });
      res.status(401).send('Invalid signature');
      return;
    }

    const payloadText = raw.toString('utf8');
    let payload;
    try {
      payload = JSON.parse(payloadText);
    } catch (err) {
      console.warn('[webhook] invalid json payload');
      res.status(400).send('Invalid JSON');
      return;
    }

    // Persist event to a local file (for simple setups). On serverless providers this is ephemeral.
    const eventsDir = path.join(process.cwd(), '.webhook_events');
    const eventsFile = path.join(eventsDir, 'flutterwave-events.json');
    try {
      await fs.mkdir(eventsDir, { recursive: true });
      let events = [];
      try {
        const existing = await fs.readFile(eventsFile, 'utf8');
        events = JSON.parse(existing || '[]');
      } catch (e) {
        events = [];
      }
      events.push({ receivedAt: new Date().toISOString(), payload });
      await fs.writeFile(eventsFile, JSON.stringify(events, null, 2), 'utf8');
    } catch (err) {
      console.warn('[webhook] failed to persist event', err.message);
    }

    // Basic payment confirmation handling example
    // Flutterwave sends different event shapes; common pattern includes payload.data.status or payload.data.tx.status
    const data = payload.data || {};
    const status = data.status || data.tx?.status || (payload?.event && payload.event === 'charge.completed' ? 'successful' : undefined);

    if (status === 'successful' || status === 'completed' || status === 'paid') {
      // Here you should update your backend database to mark the request paid.
      // Because this repo is a static frontend, we only log the event. Replace this with DB / email / notification logic.
      console.info('[webhook] payment successful', { tx_ref: data.tx_ref || data.tx?.tx_ref || payload.tx_ref });
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('[webhook] unexpected error', err);
    res.status(500).send('Internal error');
  }
}
