# How to Use Email Dev Mode

## What is Dev Mode?

Dev mode is enabled in your `.env` file with `EMAIL_DEV_MODE=true`. When enabled, verification codes are printed to the **backend terminal** instead of being sent via email.

## How to Get Verification Codes

### Step 1: Open Backend Terminal
Make sure you can see the backend terminal where `npm run start:dev` is running.

### Step 2: Request a Code
In the frontend:
- Click "Sozlamalar" (Settings) button
- Make changes to your profile
- Click "Kod yuborish" (Send Code) button

### Step 3: Check Backend Terminal
Look for a box like this in the backend terminal:

```
╔════════════════════════════════════════════════════════╗
║  📧 EMAIL VERIFICATION CODE (DEV MODE)                ║
╠════════════════════════════════════════════════════════╣
║  To: shakarovlaziz243@gmail.com                       ║
║  Code: 123456                                          ║
╚════════════════════════════════════════════════════════╝
```

### Step 4: Enter the Code
Copy the 6-digit code from the terminal and paste it into the verification field in the frontend.

## Troubleshooting

### "Code not found" error
- Make sure you clicked "Kod yuborish" button
- Check the backend terminal for the code
- The code expires after 10 minutes
- Make sure you're entering the exact 6-digit code shown in the terminal

### Dev mode not working
1. Check `.env` file has `EMAIL_DEV_MODE=true`
2. Restart the backend server
3. Look for "⚠️ EMAIL DEV MODE ENABLED" message on startup

### To disable dev mode
1. Change `EMAIL_DEV_MODE=false` in `.env`
2. Restart backend
3. Fix Gmail settings (see EMAIL_SETUP_GUIDE.md)

## Current Status

✅ Dev mode is ENABLED
✅ Codes will print to backend terminal
✅ No emails will be sent

When you're ready for production, disable dev mode and configure proper email sending.
