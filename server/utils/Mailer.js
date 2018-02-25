import Mailgun from 'mailgun-js';
import MailComposer from 'nodemailer/lib/mail-composer';

import creds from '../config/mailgun';

export default class Mailer {
    constructor() {
        this.mailgun = new Mailgun({ apiKey: creds.key, domain: creds.domain });
    }
    send(data) {
        return new Promise((resolve, reject) => {
            this.mailgun.messages().send(data, (err, body) => {
                if (err) reject(err);
                else resolve(body);
            });
        });
    }

    sendMime(data) {
        return new Promise((resolve, reject) => {
            this.mailgun.messages().sendMime(data, (err, body) => {
                if (err) reject(err);
                else resolve(body);
            });
        });
    }

    sendImportResults(err, entryRes) {
        let html =
            err == null
                ? `Hello,<br><br> Data entry for <strong>${entryRes.election_year}</strong> <strong>${
                      entryRes.election_type
                  } Election</strong> was <span style="color:#00d1b2;"><strong>successful</strong></span>. The file processed was <strong>${
                      entryRes.filename
                  }</strong> and number of rows inserted was <strong>${entryRes.numRows}</strong>.<br><br>`
                : `Hello,<br><br> Data entry for <strong>${entryRes.election_year}</strong> <strong>${
                      entryRes.election_type
                  } Election</strong> <span style="color: #ff3860;">failed</span>. The file proccessed was <strong>${
                      entryRes.filename
                  }</strong> and the error was <br><br><p style="color: #ff3860;">${err}</p><br><br>`;
        let data = {
            from: 'Votetracker <yasin@cyberserge.com>',
            subject: err == null ? 'Votetracker CSV Upload Successfull' : 'Votetracker CSV Upload Failed',
            html
        };

        let mail = new MailComposer(data);

        return new Promise((resolve, reject) => {
            mail.compile().build((err, message) => {
                if (err) reject(err);
                var data = {
                    to: err == null ? 'susan@vazomarket.com' : 'yasinyaqoobi@gmail.com',
                    message: message.toString('ascii')
                };
                this.sendMime(data)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
}
