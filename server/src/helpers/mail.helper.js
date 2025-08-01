import nodemailer from 'nodemailer';

// Setup nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an invitation email.
 * @param {string} to - The recipient's email address.
 * @param {string} token - The unique invitation token.
 */
export const sendInvitationEmail = async (to, token,title,inviteeName, todoId) => {
  // The link the user will click to accept the invite
  const invitationLink = `https://ihavtodo.netlify.app/verify/${todoId}/${token}`;

  const mailOptions = {
    from: `"IHaveToDo" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'You have been invited to collaborate!',
    html: `
      <h1>You're Invited!</h1>
      <p>You have been invited to collaborate on ${title} by ${inviteeName}</p>
      <p>Click the link below to accept the invitation:</p>
      <a href="${invitationLink}" style="padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <p>This link will expire in 48 hours.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invitation email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error('Could not send invitation email.');
  }
};