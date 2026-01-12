const nodemailer = require("nodemailer");
const hbsLib = require("nodemailer-express-handlebars");
const path = require('path');

const hbs = hbsLib.default || hbsLib;

const { SMTP_ENV, SMTPTransport } = require("../../environment/config");

async function notificationEmail(username, email, code) {
    SMTPTransport.use('compile', hbs({
        viewEngine: {
            extname: '.hbs',
            layoutsDir: path.join(__dirname, 'views/layouts'),
            defaultLayout: 'main',
            partialsDir: path.join(__dirname, 'views/partials')
        },
        viewPath: path.join(__dirname, 'views/templates'),
        extName: '.hbs'
    }));

    const mailOptions = {
        from: SMTP_ENV.from,
        to: email,
        subject: 'Welcome to Accordia IV MEAN',
        template: 'otp',
        context: {
            title: 'OTP Verification',
            username: username,
            code: code
        }
    };

    await SMTPTransport.sendMail(mailOptions);
}

module.exports = {
    notificationEmail
}