import nodemailer from "nodemailer";
class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }
    async sendActivationMail(emailTo, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: emailTo,
            subject: "Активация аккаунта на " + process.env.SITE_URL,
            text: "",
            html:
                `
                    <div style="background-color: #372d24; height: 400px">
                       <div style="background-color: #372d24 ; height: 30px; margin-top:30px"></div>
                       <div style="background-color: #814f0a ; height: 50px; margin-top:30px"></div>
                       <h1 style="color: white; text-align:center; margin-bottom:50px;margin-top:30px">Активация аккаунта</h1> 
                       <p style="color: white; padding-left:10px">Добро пожаловать на платформу "История России!" Мы рады что вы с нами.</p>
                       <p style="color: white; padding-left:10px">Давайте начнем с активации аккаунта.</p>
                       <p style="color: white; padding-left:10px; margin-bottom:50px">Для активации аккаунта перейдите по следующей ссылке.</p>
                       <a href="${link}" style="color: white; padding-left:10px;">Активировать</a>                      
                    </div>
                `
        })
    }
    async sendPasswordResetMail(emailTo, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: emailTo,
            subject: "Восстановление пароля " + process.env.SITE_URL,
            text: "",
            html:
                `
                    <div>
                        <h1>Для изменения пароля перейдите по ссылке</h1>
                        <a href="${link}">Изменить пароль</a>
                    </div>
                `
        })
    }
}
export default new MailService()