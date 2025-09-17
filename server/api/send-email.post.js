import nodemailer from "nodemailer";

const config = useRuntimeConfig();

const transporter = nodemailer.createTransport({
  host: config.emailHost,   // smtp.mail.ru
  port: 465,                // Mail.ru всегда через SSL
  secure: true,             // обязательно true для 465
  auth: {
    user: config.emailUser,     // твой e-mail на mail.ru
    pass: config.emailPassword, // пароль от почты или пароль приложения
  },
  tls: {
    rejectUnauthorized: false, // если вдруг будут ошибки сертификата
  },
});
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const options = {
    subject: "Новая заявка с сайта - lising.slf.expert",
    text: `
    Имя: ${body.name}

    Телефон: ${body.phone}

    E-mail: ${body.email}

    Практика: ${body.practic}

    Комментарий: ${body.comment}

    `,
    attachments: body.files.map((file) => {
      if (file) {
        return {
          filename: file.name,
          content: Buffer.from(file.content, "base64"), // предполагается, что файл передается в base64
        };
      }
    }),
  };

  const mailOptions = {
    from: config.emailUser,
    to: config.emailUser,
    ...options,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { status: "success" };
  } catch (error) {
    return { status: "error", message: error.message };
  }
});
