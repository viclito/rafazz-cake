import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send verification email to new admin
 */
export async function sendVerificationEmail(email, verificationToken) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/admin/verify?token=${verificationToken}`;
    
    const { data, error } = await resend.emails.send({
      from: 'Rafazz Admin <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify Your Admin Account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 40px; }
              .button { 
                display: inline-block; 
                padding: 14px 32px; 
                background: #000; 
                color: #fff; 
                text-decoration: none; 
                border-radius: 8px;
                font-weight: 500;
              }
              .footer { margin-top: 40px; color: #666; font-size: 14px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Rafazz Admin</h1>
              </div>
              <p>Thank you for registering as an admin. Please verify your email address to activate your account.</p>
              <p style="text-align: center; margin: 40px 0;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <div class="footer">
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't request this, please ignore this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification when images are updated
 */
export async function sendImageUpdateNotification(adminEmail, updateType, itemName) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Rafazz Admin <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `Image ${updateType}: ${itemName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h2>Image ${updateType}</h2>
              <p>An image has been ${updateType.toLowerCase()} in your Rafazz admin panel.</p>
              <p><strong>Item:</strong> ${itemName}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL}/admin/dashboard" 
                   style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px;">
                  View Dashboard
                </a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending notification:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message };
  }
}

export default resend;
