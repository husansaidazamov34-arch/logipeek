import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const Mailjet = require('node-mailjet');

@Injectable()
export class EmailService {
  private mailjet: any;
  private useMailjet: boolean;

  constructor(private configService: ConfigService) {
    // Hozircha faqat development mode ishlatamiz
    console.log('⚠️  EMAIL DEV MODE YOQILGAN - Kodlar konsolga yoziladi');
    console.log('⚠️  Haqiqiy email yuborish uchun Mailjet to\'g\'ri sozlang');
    this.useMailjet = false;
  }

  async sendVerificationCode(email: string, code: string) {
    // Hozircha faqat development mode
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  📧 EMAIL TASDIQLASH KODI (DEV REJIMI)                ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log(`║  Kimga: ${email.padEnd(42)} ║`);
    console.log(`║  Kod: ${code.padEnd(46)} ║`);
    console.log('╚════════════════════════════════════════════════════════╝\n');
    return true;
  }

  async sendPasswordResetCode(email: string, code: string, fullName: string) {
    // Hozircha faqat development mode
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  🔐 PAROL TIKLASH KODI (DEV REJIMI)                   ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log(`║  Kimga: ${email.padEnd(42)} ║`);
    console.log(`║  Ism: ${fullName.padEnd(44)} ║`);
    console.log(`║  Kod: ${code.padEnd(46)} ║`);
    console.log('╚════════════════════════════════════════════════════════╝\n');
    return true;
  }
}