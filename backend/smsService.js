const nodemailer = require('nodemailer');

class SMSService {
  constructor() {
    this.transporter = null;
    this.smsEmail = '14252086648@tmomail.net'; // T-Mobile SMS gateway
  }

  // Configure email settings (user provides Gmail credentials)
  configure(gmailUser, gmailAppPassword) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use TLS
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10 second timeout
      greetingTimeout: 10000
    });
  }

  // Send SMS via email-to-SMS gateway
  async sendSMS(message) {
    if (!this.transporter) {
      throw new Error('SMS service not configured. Please set up Gmail credentials.');
    }

    try {
      await this.transporter.sendMail({
        from: this.transporter.options.auth.user,
        to: this.smsEmail,
        subject: '', // Empty subject for cleaner SMS
        text: message
      });
      console.log(`SMS sent successfully to ${this.smsEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  }

  // Test if SMS service is configured
  isConfigured() {
    return this.transporter !== null;
  }
}

module.exports = new SMSService();

