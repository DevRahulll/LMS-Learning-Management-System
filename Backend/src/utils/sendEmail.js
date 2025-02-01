import nodemailer from "nodemailer";
import { config } from 'dotenv'

config();

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (email, subject, message) {

  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure:Number(process.env.SMTP_PORT)===465 , // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  
    // send mail with defined transport object
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL, // sender address
      to: email, // user email
      subject: subject, // Subject line
      html: message, // html body
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error in sendEmail function : ",error);
    throw new Error("Email sending failed")
  }
};

// console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USERNAME, process.env.SMTP_PASSWORD, process.env.SMTP_FROM_EMAIL);


export default sendEmail;
