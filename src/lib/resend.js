import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send verification email to new admin
 */
/**
 * Send approval email to Super Admin (ADMIN_EMAIL)
 */
export async function sendAdminApprovalEmail(adminEmail, newAdminName, newAdminEmail, verificationToken) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/admin/verify?token=${verificationToken}`;
    
    const { data, error } = await resend.emails.send({
      from: 'Rafazz Admin <onboarding@resend.dev>',
      to: [adminEmail],
      subject: 'ACTION REQUIRED: Approve New Admin Registration',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 40px; }
              .card { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
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
                <h1>New Admin Registration Request</h1>
              </div>
              
              <p>A new user has requested admin access. Please review the details below and approve or ignore.</p>
              
              <div class="card">
                <p><strong>Name:</strong> ${newAdminName}</p>
                <p><strong>Email:</strong> ${newAdminEmail}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>

              <p>To approve this user and allow them to log in, click the button below:</p>
              
              <p style="text-align: center; margin: 40px 0;">
                <a href="${verificationUrl}" class="button">Approve & Verify Account</a>
              </p>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              
              <div class="footer">
                <p>If you don't recognize this user, please ignore this email.</p>
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
