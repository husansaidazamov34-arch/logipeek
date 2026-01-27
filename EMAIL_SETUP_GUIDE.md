# Email Setup Guide - Gmail SMTP

## Current Issue
The application is experiencing `ECONNRESET` errors when trying to send emails through Gmail SMTP. This is a common issue with Gmail's security settings.

## Solution Steps

### Option 1: Fix Gmail App Password (Recommended)

1. **Verify 2-Step Verification is enabled**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification" if not already enabled

2. **Generate a new App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or Other)
   - Copy the 16-character password (without spaces)
   - Update `.env` file:
     ```
     EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
     ```

3. **Check "Less secure app access"**
   - Go to: https://myaccount.google.com/lesssecureapps
   - Turn ON "Allow less secure apps"
   - Note: This option may not be available if 2-Step Verification is enabled

4. **Unlock CAPTCHA**
   - Visit: https://accounts.google.com/DisplayUnlockCaptcha
   - Click "Continue" to allow access

### Option 2: Use Alternative Email Service

If Gmail continues to have issues, consider using:

#### Mailtrap (Development/Testing)
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
```

#### SendGrid (Production)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

#### Mailgun (Production)
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your_mailgun_username
EMAIL_PASSWORD=your_mailgun_password
```

## Current Configuration

The app is configured with:
- **Email**: shakarovlaziz243@gmail.com
- **App Password**: brxx eane rdoz gqen
- **SMTP Host**: smtp.gmail.com
- **Port**: 587 (STARTTLS)

## Testing Email Connection

After updating settings, restart the backend server:
```bash
cd logipeek_backend
npm run start:dev
```

Look for this message in the console:
```
✅ Email service is ready to send messages
```

If you see an error, the email configuration needs to be fixed.

## Troubleshooting

### Error: ECONNRESET
- Gmail is blocking the connection
- Try generating a new App Password
- Check if 2-Step Verification is enabled
- Visit the DisplayUnlockCaptcha link

### Error: Invalid login
- App Password is incorrect
- Regenerate the App Password
- Make sure there are no extra spaces in .env

### Error: Timeout
- Network/firewall blocking SMTP
- Try using port 465 (SSL) instead of 587
- Check antivirus/firewall settings

## Quick Fix for Development

For immediate testing, you can temporarily disable email verification:
1. Comment out email verification in registration flow
2. Or use a mock email service that logs to console instead

## Need Help?

If issues persist:
1. Check Gmail account security settings
2. Try a different Gmail account
3. Use Mailtrap for development (free, no setup needed)
4. Consider SendGrid for production (free tier: 100 emails/day)
