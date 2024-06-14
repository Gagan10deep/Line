import nodemailer from "nodemailer";

const sendEmail = async (req, email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Skywalker",
    to: email,
    subject: "Verification",
    text:
      "Hello " +
      email +
      ",\n\n" +
      "Please verify your account by clicking the link: \nhttp://" +
      req.headers.host +
      "/api/auth/confirmation/" +
      email +
      "/" +
      token.token +
      "\n\nThank You!\n",
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
