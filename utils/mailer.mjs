import nodemailer from "nodemailer";
import { google } from "googleapis";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN }); // You'll obtain this refresh token through the authentication flow


const sendEmail = async (email, code, subject, text) => {

  const accessToken = await oAuth2Client.getAccessToken();

  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     type: "OAuth2",
  //     user: "bideshonlineapp@gmail.com",
  //     clientId: CLIENT_ID,
  //     clientSecret: CLIENT_SECRET,
  //     refreshToken: process.env.REFRESH_TOKEN,
  //     accessToken: accessToken,
  //   },
  // });

  // const mailOptions = {
  //   from: "bideshonlineapp@gmail.com",
  //   to: email,
  //   subject,
  //   text,
  // };

  console.log("SENDINGGGGG maillllllll")
  // console.log(mailOptions);

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log("Error:", error);
  //   } else {
  //     console.log("Email sent:", info.response);
  //   }
  // });

  console.log("SENDINGGGGG maillllllll DONE")
};

export { sendEmail };
