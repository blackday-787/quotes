class SMSService {
  constructor() {
    this.client = null;
    this.fromNumber = null;
    this.toNumber = '+14252086648'; // Your phone number
    
    // Auto-configure from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    
    if (accountSid && authToken && fromNumber) {
      const twilio = require('twilio');
      this.client = twilio(accountSid, authToken);
      this.fromNumber = fromNumber;
      console.log('✅ Twilio SMS configured');
    } else {
      console.log('⚠️  Twilio not configured - set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER');
    }
  }

  // Send SMS via Twilio
  async sendSMS(message) {
    if (!this.client) {
      throw new Error('Twilio not configured. Set environment variables in Render.');
    }

    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.toNumber
      });
      
      console.log(`✅ SMS sent successfully! SID: ${result.sid}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send SMS:', error.message);
      throw error;
    }
  }

  // Test if SMS service is configured
  isConfigured() {
    return this.client !== null;
  }
}

module.exports = new SMSService();

