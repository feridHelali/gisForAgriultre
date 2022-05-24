/* 
nodemailer/index
*/
const nodemailer = require("nodemailer");
import { emailUser, emailPassword, apiRoot, port } from "../../config";

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
  secure: true,
}); //
export const sendMail = async (dest, token) => {
  // let url = "";
  // let subject = "";
  // let html = "";
  // if (type === "verify") {
  //   url = `${apiRoot}/activators/verify?email=${dest}&token=${fakeToken}`;
  //   subject = "MEAN-PROJECT Account Activation";
  //   html = `Please Click <a href = '${url}'>here</a> to confirm your email.`;
  // } else if (type === "reset") {
  //   url = `${FRONT}/renew-password?email=${dest}&token=${fakeToken}`;
  //   subject = "MEAN-PROJECT Password reset";
  //   html = `Please follow this the link below and provide new password.\n
  //       <a href = '${url}'>${url}</a> `;
  // }

  let url = `${apiRoot}/activators/verify?email=${dest}&token=${token}`;
  let subject = "GIS Account Activation";
  let html = `Please Click <a href = '${url}'>here</a> to confirm your email.`;

  const mailOptions = {
    from: "meanpjt@gmail.com",
    to: dest,
    subject: subject,
    html: html, 
  };

  let infos = await transporter.sendMail(mailOptions);
  console.log("info ", infos);

  return infos;
};
