import nodemailer from "nodemailer";

const host = process.env.EMAIL_SMTP_HOST;
const port = process.env.EMAIL_SMTP_PORT
  ? parseInt(process.env.EMAIL_SMTP_PORT, 10)
  : 587;
const user = process.env.EMAIL_SMTP_USER;
const pass = process.env.EMAIL_SMTP_PASS;
const from = process.env.EMAIL_FROM || "DomServices <no-reply@example.com>";

const enabled = !!(host && user && pass);

const transporter = enabled
  ? nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
  : null;

export async function sendOrderCreatedEmail(to: string, orderSummary: string) {
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from,
      to,
      subject: "DomServices – naročilo oddano",
      text: `Vaše naročilo je bilo ustvarjeno.\n\n${orderSummary}\n\nTo je testno obvestilo za šolski projekt.`,
    });
  } catch {
    // swallow errors in MVP
  }
}

export async function sendOrderStatusEmail(to: string, status: string, orderSummary: string) {
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from,
      to,
      subject: `DomServices – status naročila: ${status}`,
      text: `Status vašega naročila se je spremenil: ${status}.\n\n${orderSummary}\n\nTo je testno obvestilo za šolski projekt.`,
    });
  } catch {
    // swallow errors in MVP
  }
}

