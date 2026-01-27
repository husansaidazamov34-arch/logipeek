import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import emailjs from '@emailjs/nodejs';

@Injectable()
export class EmailService {
  private useEmailJS: boolean;

  constructor(private configService: ConfigService) {
    // Development rejimini tekshirish
    const devMode = this.configService.get('EMAIL_DEV_MODE') === 'true';
    
    if (devMode) {
      console.log('⚠️  EMAIL DEV MODE YOQILGAN - Kodlar konsolga yoziladi');
      console.log('⚠️  Haqiqiy email yuborish uchun EMAIL_DEV_MODE=false qiling');
      this.useEmailJS = false;
      return;
    }

    // EmailJS kalitlarini tekshirish
    const serviceId = this.configService.get('EMAILJS_SERVICE_ID');
    const templateId = this.configService.get('EMAILJS_TEMPLATE_ID');
    const publicKey = this.configService.get('EMAILJS_PUBLIC_KEY');
    const privateKey = this.configService.get('EMAILJS_PRIVATE_KEY');
    
    if (serviceId && templateId && publicKey && privateKey) {
      console.log('📧 Email yuborish uchun EmailJS ishlatilmoqda');
      emailjs.init({
        publicKey: publicKey,
        privateKey: privateKey,
      });
      this.useEmailJS = true;
    } else {
      console.log('❌ EmailJS kalitlari topilmadi');
      this.useEmailJS = false;
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

    if (!this.useEmailJS) {
      throw new Error('Email xizmati sozlanmagan');
    }

    try {
      const result = await emailjs.send(
        this.configService.get('EMAILJS_SERVICE_ID'),
        this.configService.get('EMAILJS_TEMPLATE_ID'),
        {
          to_email: email,
          subject: 'Email Tasdiqlash Kodi - LogiPeek',
          verification_code: code,
          app_name: 'LogiPeek',
          message: `Assalomu alaykum! LogiPeek tizimiga xush kelibsiz. Ro'yxatdan o'tishni yakunlash uchun quyidagi tasdiqlash kodini kiriting: ${code}`,
        }
      );

      console.log(`✅ Tasdiqlash kodi yuborildi: ${email} (EmailJS)`, result);
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

    if (!this.useEmailJS) {
      throw new Error('Email xizmati sozlanmagan');
    }

    try {
      const result = await emailjs.send(
        this.configService.get('EMAILJS_SERVICE_ID'),
        this.configService.get('EMAILJS_TEMPLATE_ID'),
        {
          to_email: email,
          subject: 'Parolni Tiklash Kodi - LogiPeek',
          verification_code: code,
          app_name: 'LogiPeek',
          user_name: fullName,
          message: `Assalomu alaykum, ${fullName}! Siz parolni tiklash so'rovini yubordingiz. Yangi parol o'rnatish uchun quyidagi kodni kiriting: ${code}`,
        }
      );

      console.log(`✅ Parol tiklash kodi yuborildi: ${email} (EmailJS)`, result);
      return true;
    } catch (error) {
      console.error('❌ Email yuborish xatosi:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      throw new Error('Email yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
    }
  }
}