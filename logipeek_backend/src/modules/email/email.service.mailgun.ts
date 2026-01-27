import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

@Injectable()
export class EmailService {
  private mailgun: any;
  private useMailgun: boolean;

  constructor(private configService: ConfigService) {
    // Development rejimini tekshirish
    const devMode = this.configService.get('EMAIL_DEV_MODE') === 'true';
    
    if (devMode) {
      console.log('⚠️  EMAIL DEV MODE YOQILGAN - Kodlar konsolga yoziladi');
      console.log('⚠️  Haqiqiy email yuborish uchun EMAIL_DEV_MODE=false qiling');
      this.useMailgun = false;
      return;
    }

    // Mailgun API kalitini tekshirish
    const mailgunApiKey = this.configService.get('MAILGUN_API_KEY');
    const mailgunDomain = this.configService.get('MAILGUN_DOMAIN');
    
    if (mailgunApiKey && mailgunDomain) {
      console.log('📧 Email yuborish uchun Mailgun ishlatilmoqda');
      const mg = new Mailgun(formData);
      this.mailgun = mg.client({
        username: 'api',
        key: mailgunApiKey,
      });
      this.useMailgun = true;
    } else {
      console.log('❌ MAILGUN_API_KEY yoki MAILGUN_DOMAIN topilmadi');
      this.useMailgun = false;
    }
  }

  async sendVerificationCode(email: string, code: string) {
    // Development rejimi - faqat konsolga yozish
    if (this.configService.get('EMAIL_DEV_MODE') === 'true') {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║  📧 EMAIL TASDIQLASH KODI (DEV REJIMI)                ║');
      console.log('╠════════════════════════════════════════════════════════╣');
      console.log(`║  Kimga: ${email.padEnd(42)} ║`);
      console.log(`║  Kod: ${code.padEnd(46)} ║`);
      console.log('╚════════════════════════════════════════════════════════╝\n');
      return true;
    }

    if (!this.useMailgun) {
      throw new Error('Email xizmati sozlanmagan');
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

    try {
      const result = await this.mailgun.messages.create(
        this.configService.get('MAILGUN_DOMAIN'),
        {
          from: 'LogiPeek <noreply@' + this.configService.get('MAILGUN_DOMAIN') + '>',
          to: email,
          subject: 'Email Tasdiqlash Kodi - LogiPeek',
          html: htmlContent,
        }
      );

      console.log(`✅ Tasdiqlash kodi yuborildi: ${email} (Mailgun)`, result);
      return true;
    } catch (error) {
      console.error('❌ Email yuborish xatosi:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      throw new Error('Email yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
    }
  }

  async sendPasswordResetCode(email: string, code: string, fullName: string) {
    // Development rejimi - faqat konsolga yozish
    if (this.configService.get('EMAIL_DEV_MODE') === 'true') {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║  🔐 PAROL TIKLASH KODI (DEV REJIMI)                   ║');
      console.log('╠════════════════════════════════════════════════════════╣');
      console.log(`║  Kimga: ${email.padEnd(42)} ║`);
      console.log(`║  Ism: ${fullName.padEnd(44)} ║`);
      console.log(`║  Kod: ${code.padEnd(46)} ║`);
      console.log('╚════════════════════════════════════════════════════════╝\n');
      return true;
    }

    if (!this.useMailgun) {
      throw new Error('Email xizmati sozlanmagan');
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

    try {
      const result = await this.mailgun.messages.create(
        this.configService.get('MAILGUN_DOMAIN'),
        {
          from: 'LogiPeek <noreply@' + this.configService.get('MAILGUN_DOMAIN') + '>',
          to: email,
          subject: 'Parolni Tiklash Kodi - LogiPeek',
          html: htmlContent,
        }
      );

      console.log(`✅ Parol tiklash kodi yuborildi: ${email} (Mailgun)`, result);
      return true;
    } catch (error) {
      console.error('❌ Email yuborish xatosi:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      throw new Error('Email yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
    }
  }
}