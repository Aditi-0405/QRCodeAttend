const nodemailer = require('nodemailer')
require('dotenv').config();
const service = process.env.NODEMAILER_SERVICE;
const pass = process.env.NODEMAILER_PASS;
const sender = process.env.NODEMAILER_SENDER;

var transporter = nodemailer.createTransport({
    service: service,
    auth: {
        user: sender,
        pass: pass
    }
});
const sendmail = async (username, email, password) => {

    var mailOptions = {
        from: sender,
        to: email,
        subject: 'Successfully Registered on QRAttend',
        text: `You have been registered on QRAttend Platform successfully.
        Your Username: ${username}
        Your Password: ${password}`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendmail };