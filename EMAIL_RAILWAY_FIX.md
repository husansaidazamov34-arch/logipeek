# Email Service Fix for Railway Deployment

## Problem
Railway blocks SMTP connections (ports 25, 465, 587, 2525) on **Free, Trial, and Hobby plans**. SMTP is only available on **Pro and Enterprise plans** ($5/month+).

Your Gmail SMTP configuration is correct, but Railway is blocking the connection, causing timeout errors.

## Solutions

### Option 1: Upgrade to Railway Pro Plan (Recommended)
- **Cost**: $5/month
- **Benefits**: SMTP access + better resources
- **Setup**: Upgrade plan in Railway dashboard
- **Result**: Your current Gmail SMTP will work immediately

### Option 2: Enable Development Mode (Temporary)
**Quick fix for testing:**

1. Go to Railway project → Backend service → Variables
2. Change `EMAIL_DEV_MODE` from `false` to `true`
3. Service will redeploy automatically

**Result**: Verification codes will be logged to Railway console instead of sent via email.

**To see codes:**
1. Go to Railway → Backend service → Deployments
2. Click on latest deployment → View logs
3. Look for verification codes in console output

### Option 3: Use SendGrid API (Free Alternative)
**Free tier**: 100 emails/day

#### Step 1: Create SendGrid Account
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for free account
3. Verify your email

#### Step 2: Get API Key
1. Go to Settings → API Keys
2. Create API Key with "Full Access"
3. Copy the API key (starts with `SG.`)

#### Step 3: Add to Railway
Add these environment variables in Railway:
```
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_USER=noreply@logipeek.com
```

#### Step 4: Install SendGrid Package
```bash
cd logipeek_backend
npm install @sendgrid/mail
```

#### Step 5: Replace Email Service
Replace `src/modules/email/email.service.ts` with the SendGrid version:
```bash
cp src/modules/email/email.service.sendgrid.ts src/modules/email/email.service.ts
```

### Option 4: Use Other Email APIs
**Alternatives with free tiers:**
- **Mailgun**: 1000 emails/month free
- **Resend**: 3000 emails/month free  
- **Brevo**: 300 emails/day free

## Current Environment Variables
Your Railway backend should have:
```
NODE_ENV=production
JWT_SECRET=logipeek_super_secret_jwt_key_change_in_production_2024
JWT_EXPIRE=7d
ENCRYPTION_SECRET=logipeek_encryption_secret_key_for_sensitive_data_2024_change_in_production
CORS_ORIGIN=https://nurturing-sparkle-production-1402.up.railway.app
SUPER_ADMIN=pes159541@gmail.com
EMAIL_USER=shakarovlaziz243@gmail.com
EMAIL_PASSWORD=brxxeanerdozgqen
EMAIL_DEV_MODE=true  # Set to true for now
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
MONGODB_URI=mongodb+srv://logipeek_db_user:admin123@cluster0.hzggjlp.mongodb.net/logipeek_db?retryWrites=true&w=majority&appName=Cluster0
```

## Recommendation
1. **Immediate**: Set `EMAIL_DEV_MODE=true` to test registration flow
2. **Short-term**: Set up SendGrid for free email sending
3. **Long-term**: Consider Railway Pro plan for full SMTP access

## Testing Registration Flow
With `EMAIL_DEV_MODE=true`:
1. User registers on frontend
2. Backend generates verification code
3. Code is logged to Railway console (not emailed)
4. Check Railway logs to see the code
5. User enters code to complete registration

This allows you to test the complete flow while working on the email solution.