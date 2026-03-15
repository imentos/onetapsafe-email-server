// server.js
const express = require('express');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
app.use(express.json());

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'OneTap OK Email Server Running' });
});

// Send email alert endpoint
app.post('/api/send-alert', async (req, res) => {
  const { email, contactName, userName, missedCheckIn, isEmergency, currentTime } = req.body;
  
  // Validate required fields
  if (!email || !contactName || !userName) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: email, contactName, userName' 
    });
  }
  
  // Create email message based on alert type
  let msg;
  
  if (isEmergency) {
    // Emergency Alert
    msg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: `🚨 EMERGENCY ALERT - ${userName} needs immediate help`,
      text: `EMERGENCY ALERT

Hi ${contactName},

${userName} has triggered an EMERGENCY ALERT from OneTap OK.

Alert time: ${currentTime || new Date().toLocaleString()}

⚠️ THIS IS AN URGENT REQUEST FOR HELP ⚠️

Please reach out to ${userName} IMMEDIATELY to ensure they are safe.

---
OneTap OK - Automated Safety Check-In System
Do not reply to this email.`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 3px solid #d32f2f;">
        <div style="background: #d32f2f; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🚨 EMERGENCY ALERT</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Hi <strong>${contactName}</strong>,</p>
          
          <div style="background: #ffebee; border-left: 6px solid #d32f2f; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; color: #d32f2f; font-weight: bold;">
              ${userName} has triggered an EMERGENCY ALERT
            </p>
          </div>
          
          <p><strong>Alert time:</strong> ${currentTime || new Date().toLocaleString()}</p>
          
          <div style="background: #fff3cd; border: 2px solid #ff9800; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #d32f2f;">
              ⚠️ THIS IS AN URGENT REQUEST FOR HELP ⚠️
            </p>
          </div>
          
          <p style="font-size: 16px; font-weight: bold;">
            Please reach out to ${userName} IMMEDIATELY to ensure they are safe.
          </p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center;">
          <p style="font-size: 12px; color: #666; margin: 0;">
            OneTap OK - Automated Safety Check-In System<br>
            Do not reply to this email.
          </p>
        </div>
      </div>
    `
    };
  } else {
    // Missed Check-In Alert (original)
    msg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: `⚠️ ${userName} Missed Daily Check-In - OneTap OK`,
      text: `Hi ${contactName},

This is an automated safety alert from OneTap OK.

${userName} has missed their daily safety check-in scheduled for today.

Check-in was expected at: ${missedCheckIn || 'today'}
Current time: ${new Date().toLocaleString()}

This message was sent because you are listed as an emergency contact.

Please reach out to ${userName} to ensure they are safe.

---
OneTap OK - Automated Safety Check-In System
Do not reply to this email.`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">⚠️ Missed Check-In Alert</h2>
        
        <p>Hi <strong>${contactName}</strong>,</p>
        
        <p>This is an automated safety alert from <strong>OneTap OK</strong>.</p>
        
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
          <strong>${userName}</strong> has missed their daily safety check-in.
        </div>
        
        <p><strong>Expected check-in:</strong> ${missedCheckIn || 'Today'}<br>
        <strong>Current time:</strong> ${new Date().toLocaleString()}</p>
        
        <p>This message was sent because you are listed as an emergency contact.</p>
        
        <p><strong>Please reach out to ${userName} to ensure they are safe.</strong></p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666;">
          OneTap OK - Automated Safety Check-In System<br>
          Do not reply to this email.
        </p>
      </div>
    `
    };
  }
  
  try {
    await sgMail.send(msg);
    console.log(`✅ ${isEmergency ? 'Emergency' : 'Alert'} email sent to ${email} (${contactName})`);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ SendGrid error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test endpoint (for debugging)
app.post('/api/test-email', async (req, res) => {
  const msg = {
    to: req.body.email || process.env.TEST_EMAIL,
    from: process.env.SENDER_EMAIL,
    subject: 'OneTap OK Test Email',
    text: 'This is a test email from OneTap OK server.',
    html: '<p><strong>This is a test email from OneTap OK server.</strong></p>'
  };
  
  try {
    await sgMail.send(msg);
    console.log('✅ Test email sent');
    res.json({ success: true, message: 'Test email sent' });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 OneTap OK Email Server running on port ${PORT}`);
  console.log(`Sender email: ${process.env.SENDER_EMAIL}`);
});
