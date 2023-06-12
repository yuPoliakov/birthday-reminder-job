import nodemailer from 'nodemailer';

export const sendReminder = (email, reminder) => {
    const { EMAIL_USER, EMAIL_PASS, EMAIL_SERVICE } = process.env;

    var transporter = nodemailer.createTransport({
        service: EMAIL_SERVICE,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    var mailOptions = {
        from: 'Birthday Reminder',
        to: email,
        subject: 'Your Birhtday Reminder',
        html: `Hey! It's time to remember your's friend birthday!
                ${reminder.day} ${reminder.month} ${reminder.year || ''}
                ${reminder.text || ''}
            `
    };

    return transporter.sendMail(mailOptions);
}