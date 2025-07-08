// notificationUtil.js
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Set up nodemailer for email notifications
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Set up Twilio client for SMS notifications
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendNotification = async (user, message) => {
  // Send email notification
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Queue Appointment Update',
    text: message,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  // Send SMS notification (Twilio)
  if (user.phoneNumber) {
    client.messages
      .create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
        to: user.phoneNumber, // User's phone number (should be stored in the user profile)
      })
      .then((message) => console.log('SMS sent:', message.sid))
      .catch((error) => console.log('Error sending SMS:', error));
  }
};
