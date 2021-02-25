import nodemailer, { Transporter } from 'nodemailer';


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

    async execute(to: string, subject: string, body: string) {
        const message = await this.client.sendMail({
            to,
            subject,
            html: body,
            from: 'NPS <noreplay@nps.com.br>'
        });

        console.log(nodemailer.getTestMessageUrl(message));
    }
}


export default new SendMailService();
