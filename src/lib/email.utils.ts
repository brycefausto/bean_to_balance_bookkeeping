import {
  APP_NAME,
  MAIL_DISABLED,
  MAIL_PASSWORD,
  MAIL_USER,
  MAILTRAP_HOST,
  MAILTRAP_PASS,
  MAILTRAP_PORT,
  MAILTRAP_USER,
  NODE_ENV,
} from "@/config/env";
import * as nodemailer from "nodemailer";
import { compileTemplate } from "./template.utils";

const transporter = nodemailer.createTransport(
  NODE_ENV == "development"
    ? {
        host: MAILTRAP_HOST,
        port: MAILTRAP_PORT,
        auth: {
          user: MAILTRAP_USER,
          pass: MAILTRAP_PASS,
        },
      }
    : {
        service: "gmail",
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASSWORD,
        },
      }
);

const mailUser = `${MAILTRAP_USER}@${MAILTRAP_HOST}`;
const mailFrom = `${APP_NAME} <${mailUser}>`;

export const registeredAccountTemplate = "registeredAccount.html";
export const requestResetPasswordTemplate = "requestResetPassword.html";
export const resetPasswordTemplate = "resetPassword.html";
export const deletedAccountTemplate = "deletedAccount.html";
export const receivedOrderTemplate = "receivedOrder.ejs";

export const sendMail = async (
  toEmail: string,
  subject: string,
  template: string,
  payload: any
) => {
  if (!MAIL_DISABLED) {
    const copyrightYear = new Date().getFullYear();
    const mailOptions = {
      from: mailFrom,
      to: toEmail,
      subject,
      html: await compileTemplate(template, {
        appName: APP_NAME,
        ...payload,
        copyrightYear,
      }),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.log(error);
    }
  }
};
