import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private useSendGrid: boolean;

  constructor(private configService: ConfigService) {
    // Check if in development mode
    const devMode = this.configService.get('EMAIL_DEV_MODE') === 'true';
    
    if (devMode) {
      console.log('⚠️  EMAIL DEV MODE ENABLED - Codes will be logged to console');
      console.log('⚠️  Set EMAIL_DEV_MODE=false in .env to enable real email sending');
      // Create a dummy transporter for dev mode
      this.transporter = null as any;
      this.useSendGrid = false;
      return;
    }

    // Check if SendGrid API key is available
    const sendGridApiKey = this.configService.get('SENDGRID_API_KEY');
    if (sendGridApiKey) {
      console.log('📧 Using SendGrid for email delivery');
      sgMail.setApiKey(sendGridApiKey);
      this.useSendGrid = true;
      this.transporter = null as any;
      return;
    }

    // Fallback to Gmail SMTP configuration with STARTTLS (port 587)
    console.log('📧 Using Gmail SMTP for email delivery');
    this.useSendGrid = false;
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get('EMAIL_HOST') || 'smtp.gmail.com',
      port: parseInt(this.configService.get('EMAIL_PORT')) || 587,
      secure: this.configService.get('EMAIL_SECURE') === 'true' || false, // Use STARTTLS
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 60000,     // 60 seconds
    });

    // Verify connection on startup
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email service connection failed:', error.message);
        console.log('📧 Please check your EMAIL_USER and EMAIL_PASSWORD in .env file');
        console.log('📧 Or follow EMAIL_SETUP_GUIDE.md for troubleshooting');
      } else {
        console.log('✅ Email service is ready to send messages');
      }
    });
  }

  async sendVerificationCode(email: string, code: string) {
    // Development mode - just log the code
    if (this.configService.get('EMAIL_DEV_MODE') === 'true') {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║  📧 EMAIL VERIFICATION CODE (DEV MODE)                ║');
      console.log('╠════════════════════════════════════════════════════════╣');
      console.log(`║  To: ${email.padEnd(45)} ║`);
      console.log(`║  Code: ${code.padEnd(43)} ║`);
      console.log('╚════════════════════════════════════════════════════════╝\n');
      return true;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚚 LogiPeek</h1>
        </div>
        
        <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0;">Email Tasdiqlash</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Assalomu alaykum! LogiPeek tizimiga xush kelibsiz.
          </p>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Ro'yxatdan o'tishni yakunlash uchun quyidagi tasdiqlash kodini kiriting:
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            ⏰ Bu kod 10 daqiqa davomida amal qiladi.
          </p>
          <p style="color: #ef4444; font-size: 14px; line-height: 1.6;">
            ⚠️ Agar siz bu so'rovni yubormasangiz, bu xabarni e'tiborsiz qoldiring.
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              © 2026 LogiPeek. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </div>
    `;

    if (this.useSendGrid) {
      // Use SendGrid API
      const msg = {
        to: email,
        from: this.configService.get('EMAIL_USER') || 'noreply@logipeek.com',
        subject: 'Email Tasdiqlash Kodi - LogiPeek',
        html: htmlContent,
      };

      try {
        await sgMail.send(msg);
        console.log(`✅ Verification code sent to ${email} via SendGrid`);
        return true;
      } catch (error) {
        console.error('❌ SendGrid email sending error:', error);
        throw new Error('Email yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
      }
    } else {
      // Use SMTP (Gmail)
      const mailOptions = {
        from: `"LogiPeek" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject: 'Email Tasdiqlash Kodi - LogiPeek',
        html: htmlContent,
      };

      try {
        // Retry logic: try up to 3 times
        let lastError;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Verification code sent to ${email} (attempt ${attempt})`);
            return true;
          } catch (error) {
            lastError = error;
            console.error(`❌ Email sending attempt ${attempt} failed:`, error.message);
            if (attempt < 3) {
              // Wait 2 seconds before retry
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        
        // All attempts failed
        console.error('❌ All email sending attempts failed:', lastError);
        throw new Error('Email yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
      } catch (error) {
        console.error('❌ Email sending error:', error);
        throw new Error('Email yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
      }
    }
  }

  async sendPasswordResetCode(email: string, code: string, fullName: string) {
    // Development mode - just log the code
    if (this.configService.get('EMAIL_DEV_MODE') === 'true') {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║  🔐 PASSWORD RESET CODE (DEV MODE)                    ║');
      console.log('╠════════════════════════════════════════════════════════╣');
      console.log(`║  To: ${email.padEnd(45)} ║`);
      console.log(`║  Name: ${fullName.padEnd(43)} ║`);
      console.log(`║  Code: ${code.padEnd(43)} ║`);
      console.log('╚════════════════════════════════════════════════════════╝\n');
      return true;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚚 LogiPeek</h1>
        </div>
        
        <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0;">Parolni Tiklash</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Assalomu alaykum, ${fullName}!
          </p>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Siz parolni tiklash so'rovini yubordingiz. Yangi parol o'rnatish uchun quyidagi kodni kiriting:
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            ⏰ Bu kod 10 daqiqa davomida amal qiladi.
          </p>
          <p style="color: #ef4444; font-size: 14px; line-height: 1.6;">
            ⚠️ Agar siz bu so'rovni yubormasangiz, bu xabarni e'tiborsiz qoldiring va parolingiz xavfsiz qoladi.
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              © 2026 LogiPeek. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </div>
    `;

    if (this.useSendGrid) {
      // Use SendGrid API
      const msg = {
        to: email,
        from: this.configService.get('EMAIL_USER') || 'noreply@logipeek.com',
        subject: 'Parolni Tiklash Kodi - LogiPeek',
        html: htmlContent,
      };

      try {
        await sgMail.send(msg);
        console.log(`✅ Password reset code sent to ${email} via SendGrid`);
        return true;
      } catch (error) {
        console.error('❌ SendGrid email sending error:', error);
        throw new Error('Email yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
      }
    } else {
      // Use SMTP (Gmail)
      const mailOptions = {
        from: `"LogiPeek" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject: 'Parolni Tiklash Kodi - LogiPeek',
        html: htmlContent,
      };

      try {
        // Retry logic: try up to 3 times
        let lastError;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password reset code sent to ${email} (attempt ${attempt})`);
            return true;
          } catch (error) {
            lastError = error;
            console.error(`❌ Email sending attempt ${attempt} failed:`, error.message);
            if (attempt < 3) {
              // Wait 2 seconds before retry
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        
        // All attempts failed
        console.error('❌ All email sending attempts failed:', lastError);
        throw new Error('Email yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
      } catch (error) {
        console.error('❌ Email sending error:', error);
        throw new Error('Email yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
      }
    }
  }
}