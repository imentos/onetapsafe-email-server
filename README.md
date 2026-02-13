# OneTapSafe Email Server

Automatic email alert server for OneTapSafe using SendGrid.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
SENDGRID_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=your_verified_email@gmail.com
TEST_EMAIL=your_email@gmail.com
PORT=3000
```

3. Run locally:
```bash
node server.js
```

4. Test:
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

## Deploy to Railway

1. Push to GitHub
2. Connect to Railway
3. Add environment variables in Railway dashboard
4. Deploy!

## Environment Variables

- `SENDGRID_API_KEY` - Your SendGrid API key
- `SENDER_EMAIL` - Your verified SendGrid sender email
- `TEST_EMAIL` - Email for testing (optional)
- `PORT` - Server port (Railway sets this automatically)
