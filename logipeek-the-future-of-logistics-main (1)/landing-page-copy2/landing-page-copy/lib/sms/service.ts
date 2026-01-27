
interface SMSService {
    sendOTP(phone: string, code: string): Promise<boolean>;
}

class ConsoleSMSService implements SMSService {
    async sendOTP(phone: string, code: string): Promise<boolean> {
        console.log(`[SMS MOCK] Sending OTP to ${phone}: ${code}`);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
}

// In a real app, you would switch this based on env vars
// e.g., return process.env.SMS_PROVIDER === 'twilio' ? new TwilioService() : new ConsoleSMSService();
export const smsService = new ConsoleSMSService();
