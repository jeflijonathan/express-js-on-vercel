import nodemailer from "nodemailer";

interface SendMailProps {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = async ({ to, subject, html, text }: SendMailProps) => {
  try {
    if (!to)
      throw {
        status: "Error",
        statusCode: 400,
        message: "Recipient email is invalid",
      };

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Mailer Error:", error);
    throw {
      status: "Error",
      statusCode: 500,
      message: "Failed to send email",
    };
  }
};
