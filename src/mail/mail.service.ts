import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'andrebordignonn@gmail.com',
        pass: 'uxjk cbgb lidm phkt',
      },
    });
  }

  async sendUserConfirmation(user: any, token: string) {
    const confirmationLink = `http://localhost:5173/login/confirm?token=${token}`;
    const emailBody = `Hello ${user.firstName},\n\nWelcome to our platform! Please click on the following link to confirm your email address: ${confirmationLink}\n\nRegards,\nThe Team`;
    const info = await this.transporter.sendMail(
      {
        to: user.email,
        subject: 'Welcome user! Confirm your Email',
        text: emailBody,
      },
      (e) => console.error('erro', e),
    );
    console.log('info', info);
  }

  // Other email sending methods...
}
