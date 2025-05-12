import nodemailer from 'nodemailer';

async function sendMail(to, name, body, subject) {
    const smtp = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await smtp.sendMail({
        to, 
        subject,
        html: body
    });
}

export default sendMail;