import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }

  return transporter;
};

const send = async ({ to, subject, html }) => {
  const t = getTransporter();

  if (!t) {
    console.log('\n--- EMAIL (dev fallback, no SMTP configured) ---');
    console.log(`To: ${to}\nSubject: ${subject}\n${html}`);
    console.log('--- END EMAIL ---\n');
    return;
  }

  await t.sendMail({
    from: process.env.EMAIL_FROM || 'Job Portal <no-reply@jobportal.com>',
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (user, rawToken) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;
  await send({
    to: user.email,
    subject: 'Verify your Job Portal account',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Welcome, ${user.name} 👋</h2>
        <p>Confirm your email to activate your ${user.role} account.</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none">Verify Email</a>
        <p style="color:#666;font-size:13px;margin-top:16px">This link expires in 24 hours. If the button doesn't work, copy this link:<br/>${verifyUrl}</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (user, rawToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
  await send({
    to: user.email,
    subject: 'Reset your Job Portal password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Reset your password</h2>
        <p>Click below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none">Reset Password</a>
        <p style="color:#666;font-size:13px;margin-top:16px">If you didn't request this, you can ignore this email.<br/>${resetUrl}</p>
      </div>
    `,
  });
};
