import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP settings are not fully configured. Email sending will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

const sendMail = async (to, subject, html) => {
  if (!transporter) {
    console.warn('Email transport is not configured. Skipping email send:', subject);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Future Path <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendWelcomeEmail = async (user) => {
  const loginUrl = process.env.CLIENT_URL || 'http://localhost:5173/login';
  const html = `
    <div style="font-family: sans-serif; color: #1f2937;">
      <h2>Welcome to the Course Management System, ${user.name}!</h2>
      <p>Thank you for registering with Future Path.</p>
      <p>Your account is ready, and you can login using the button below.</p>
      <a href="${loginUrl}" style="display: inline-block; padding: 12px 20px; margin: 16px 0; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px;">Login to Future Path</a>
      <p>Discover courses, track your applications, and manage your profile from your dashboard.</p>
      <p>Best regards,<br/>Future Path Team</p>
    </div>
  `;

  await sendMail(user.email, 'Welcome to the Course Management System', html);
};

export const sendEnrollmentEmail = async (user, course, registration) => {
  const html = `
    <div style="font-family: sans-serif; color: #111827;">
      <h2>Course Enrollment Successful</h2>
      <p>Dear ${user.name},</p>
      <p>Thank you for enrolling in <strong>${course.title}</strong>.</p>
      <p>Here are the course details:</p>
      <ul>
        <li><strong>Program:</strong> ${course.title}</li>
        <li><strong>Organization:</strong> ${course.organization}</li>
        <li><strong>Start Date:</strong> ${new Date(course.startDate).toLocaleDateString()}</li>
        <li><strong>Schedule:</strong> ${course.schedule}</li>
        <li><strong>Location:</strong> ${course.location}</li>
        <li><strong>Contact:</strong> ${course.contactNumber} / ${course.email}</li>
      </ul>
      <p>Your registration has been sent and is now pending admin approval.</p>
      <p>Enrollment Date: ${new Date(registration.createdAt).toLocaleDateString()}</p>
      <p>If you have any questions, please contact the institute directly.</p>
      <p>Best wishes,<br/>Future Path Admissions Team</p>
    </div>
  `;

  await sendMail(user.email, 'Course Enrollment Successful', html);
};
