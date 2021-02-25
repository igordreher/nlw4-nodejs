import nodemailer, { Transporter } from 'nodemailer';
import handleBars from 'handlebars';
import path from 'path';
import fs from 'fs';


class SendMailService {
    client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then((account) => {
            this.client = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
        });
    }

    async execute(to: string, subject: string, variables: object, path: string) {
        const templateFileContent = fs.readFileSync(path).toString('utf-8');
        const templateParse = handleBars.compile(templateFileContent);

        const html = templateParse(variables);

        const message = await this.client.sendMail({
            to,
            subject,
            html: html,
            from: 'NPS <noreplay@nps.com.br>'
        });

        console.log(nodemailer.getTestMessageUrl(message));
    }
}


export default new SendMailService();
