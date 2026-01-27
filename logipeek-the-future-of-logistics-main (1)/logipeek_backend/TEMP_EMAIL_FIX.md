# Temporary Email Fix for Development

## Problem
Gmail SMTP is being blocked by your network or Gmail security settings, causing `ECONNRESET` errors.

## Quick Solutions

### Option 1: Fix Gmail Settings (5 minutes)

1. **Enable 2-Step Verification**
   - Visit: https://myaccount.google.com/security
   - Turn on "2-Step Verification"

2. **Generate New App Password**
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "LogiPeek"
   - Copy the 16-character password
   - Update `.env`:
     ```
     EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
     ```

3. **Allow Access**
   - Visit: https://accounts.google.com/DisplayUnlockCaptcha
   - Click "Continue"

4. **Restart Backend**
   ```bash
   # Stop current server (Ctrl+C)
   cd logipeek_backend
   npm run start:dev
   ```

### Option 2: Use Mailtrap (Recommended for Development)

Mailtrap is a fake SMTP server perfect for testing:

1. **Sign up** at https://mailtrap.io (free)

2. **Get credentials** from your inbox settings

3. **Update `.env`**:
   ```env
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your_mailtrap_username
   EMAIL_PASSWORD=your_mailtrap_password
   ```

4. **Update `email.service.ts`** constructor:
   ```typescript
   this.transporter = nodemailer.createTransport({
     host: this.configService.get('EMAIL_HOST') || 'smtp.gmail.com',
     port: parseInt(this.configService.get('EMAIL_PORT')) || 465,
     secure: this.configService.get('EMAIL_PORT') === '465',
     auth: {
       user: this.configService.get('EMAIL_USER'),
       pass: this.configService.get('EMAIL_PASSWORD'),
     },
   });
   ```

### Option 3: Disable Email Verification (Quick Test Only)

**WARNING**: Only for local testing, never in production!

1. **Comment out email verification** in `SettingsDialog.tsx`:
   ```typescript
   // Skip email verification for testing
   // await handleSendCode();
   // setStep(2);
   
   // Directly update profile
   await updateProfile.mutateAsync({
     fullName: formData.fullName,
     email: formData.email,
     phone: formData.phone,
     password: formData.password || undefined,
   });
   ```

## Why This Happens

- **Network Firewall**: Your ISP/network blocks port 587/465
- **Gmail Security**: Gmail blocks suspicious login attempts
- **Antivirus**: Security software blocking SMTP
- **VPN/Proxy**: Network routing issues

## Testing Email Connection

Run this in your terminal:
```bash
cd logipeek_backend
node -e "const nodemailer = require('nodemailer'); const t = nodemailer.createTransport({host:'smtp.gmail.com',port:465,secure:true,auth:{user:'shakarovlaziz243@gmail.com',pass:'brxx eane rdoz gqen'}}); t.verify((e,s)=>console.log(e||'✅ Connected'));"
```

If this fails, the issue is network/Gmail, not the code.

## Recommended Solution

For development: **Use Mailtrap** (Option 2)
- No Gmail setup needed
- See all emails in web interface
- Free and instant setup
- Works on any network

For production: **Use SendGrid or Mailgun**
- More reliable than Gmail
- Better deliverability
- Professional email service
