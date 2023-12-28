import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: String, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      //   TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'mahdi.webx@gmail.com',
      pass: 'hlrz wlll zhor lfzb',
    },
  });

  await transporter.sendMail({
    from: 'mahdi.webx@gmail.com',
    to: 'rrahat415@gmail.com',
    subject: 'RESET YOUR password within 10 minutes.',
    text: '',
    html,
  });
};
