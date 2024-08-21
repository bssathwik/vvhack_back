import nodemailer from 'nodemailer';


// Configure your SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'smtp.mailgun.org' or 'smtp.ethereal.email'
    auth: {
        user: 'balabhadrasaisathwik@gmail.com', // Your email address
        pass: 'szhm bnbn caos mhkf'   // Your email password or an app password if using 2FA
    }
});

export const sendVerificationEmail = async (to, verificationCode) => {
    const mailOptions = {
        from: 'balabhadrasaisathwik@gmail.com', 
        to: to,
        subject: 'Your Verification Code',
        text: `Here is your verification code: ${verificationCode}`
    };
                               
    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};