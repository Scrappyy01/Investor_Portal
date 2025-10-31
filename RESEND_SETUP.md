# Resend Domain Verification Setup

## Current Status
- Sender email: `onboarding@loadlink.com.au`
- API Key: Configured in `.env.local`
- Recipients: `hortondylan010@gmail.com`, `dylan@loadlink.com.au`

## To Complete Setup

### Step 1: Add Domain to Resend Dashboard
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter: `loadlink.com.au`
4. Resend will give you DNS records to add

### Step 2: Add DNS Records
You need to add these DNS records to your domain registrar (wherever loadlink.com.au is registered):

Resend will provide:
- **CNAME record** for verification (looks like: `xxxxxxxx.loadlink.com.au CNAME xxxxx.resend.dev`)
- **SPF record** (TXT): `v=spf1 include:sendingdomain.resend.dev ~all`
- **DKIM record** (TXT): provided by Resend
- **DMARC record** (TXT): optional but recommended

### Step 3: Verify & Activate
Once DNS records are added (may take 24-48 hours to propagate):
1. Return to Resend dashboard
2. Click "Verify Domain"
3. Once verified, the domain will be active for sending

## Current Workaround
If you want to test immediately without domain setup:
- Change sender in `route.ts` to: `from: "onboarding@resend.dev"`
- This is Resend's sandbox domain - works immediately for testing
- Replace with verified domain once setup complete

## Production vs Testing
- **Testing (now)**: Can use `resend.dev` domain or set up actual domain
- **Production (later)**: Must use verified domain like `loadlink.com.au`

## References
- Resend Docs: https://resend.com/docs/dashboard/domains
- Current API Endpoint: `/api/onboarding/generate-pdf`
- Email Template Location: `app/api/onboarding/generate-pdf/route.ts` (lines 411+)
