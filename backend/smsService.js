const sgMail = require('@sendgrid/mail');

class SMSService {
  constructor() {
    this.configured = false;
    this.smsEmail = '14252086648@tmomail.net'; // T-Mobile SMS gateway
    this.fromEmail = null;
  }

  // Configure SendGrid (user provides API key and from email)
  configure(sendgridApiKey, fromEmail) {
    sgMail.setApiKey(sendgridApiKey);
    this.fromEmail = fromEmail;
    this.configured = true;
  }

  // Send SMS via email-to-SMS gateway using SendGrid
  async sendSMS(message) {
    if (!this.configured) {
      throw new Error('SMS service not configured. Please set up SendGrid API key.');
    }

    try {
      await sgMail.send({
        to: this.smsEmail,
        from: this.fromEmail,
        subject: '', // Empty subject for cleaner SMS
        text: message
      });
      console.log(`SMS sent successfully to ${this.smsEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      if (error.response) {
        console.error('SendGrid error details:', error.response.body);
      }
      throw new Error(error.response?.body?.errors?.[0]?.message || error.message);
    }
  }

  // Test if SMS service is configured
  isConfigured() {
    return this.configured;
  }
}

module.exports = new SMSService();

