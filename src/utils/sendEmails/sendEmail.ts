import transport from './emailConfig';
import { ClientEmail } from './types/email';

const sendEmail = (client: ClientEmail, html: string) => {
  transport.sendMail({
    from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
    to: `${client.name} <${client.email}>`,
    subject: 'Welcome to our platform',
    html,
  });
};

export default sendEmail;
