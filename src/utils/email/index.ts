import {getChecklistEmailTemplate} from './templates';
import {formatDate} from '../date';

const nodemailer = require('nodemailer');

const MNS_CONFIG = {
  host: '192.168.65.20',
  port: 25,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'no-reply@mns.intnet.mu',
    pass: 'mns@12345',
  },
  tls: {rejectUnauthorized: false},
};

const BREVO_CONFIG = {
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'development.mns@gmail.com',
    pass: 'sqT2KDnhN69WjQfz',
  },
  tls: {rejectUnauthorized: false},
};

class WhoEmail {
  transporter;
  IPC_OFFICER_EMAIL = 'ipcchecklistmru@gmail.com';

  setupTransport() {
    try {
      this.transporter = nodemailer.createTransport(BREVO_CONFIG);
    } catch (e) {
      console.log(e);
    }
  }

  getTransport() {
    return this.transporter;
  }

  getOfficerEmail() {
    const baseUrl = process.env.BASE_URL;
    switch (true) {
      // TODO: modify this to use the new domain
      case !!baseUrl.match('prod'):
        return this.IPC_OFFICER_EMAIL;
      default:
        return '';
    }
  }

  async sendEmail(data: {
    to: string;
    subject: string;
    text?: string;
    html: string;
    attachments?: any[];
  }) {
    const {to, subject, text, html, attachments} = data;
    try {
      await this.getTransport().sendMail({
        from: 'no-reply@mns.intnet.mu', // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
        attachments,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async sendAttachmentToIPCOfficer(data: {
    email: string;
    fullName: string;
    attachment: any;
    checklistName: string;
    hospitalName: string;
    submittedDate: string;
    ward: string;
    visitingTeam: string;
    department: string;
  }) {
    const {
      email,
      fullName,
      ward,
      visitingTeam,
      department,
      attachment,
      checklistName,
      hospitalName,
      submittedDate,
    } = data;

    const formattedSubmittedDate = formatDate(submittedDate, 'date-time');

    await this.sendEmail({
      to: [email, this.getOfficerEmail()].join(', '),
      subject: `${checklistName} ${hospitalName} (${formattedSubmittedDate})`,
      html: getChecklistEmailTemplate({
        hospital: hospitalName,
        submittedDate: formattedSubmittedDate,
        ward,
        visitingTeam,
        user: fullName,
        checklist: checklistName,
        department,
      }),
      attachments: [attachment],
    });
  }
}

export const mailInstance = new WhoEmail();
