import { sendReminder } from './utils/sendReminder.js';
import db from './db/mongoDB.js';
import 'dotenv/config';

const dbConfig = {
    location: 'mongoDB',
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    pass: process.env.MONGO_PASS,
    user: process.env.MONGO_USER,
    db: process.env.MONGO_DB
};

const isTimeToSend = (reminder, time) => {
    const nowDate = new Date(time);
    const reminderDate = new Date();

    if (reminder.year) {
        reminderDate.setFullYear(reminder.year);
    }

    reminderDate.setDate(reminder.day);
    reminderDate.setMonth(reminder.month - 1);

    if (reminder.daysBefore) {
        nowDate.setDate(nowDate.getDate() + Number(reminder.daysBefore));
    }

    return nowDate.getDate() === reminderDate.getDate() && nowDate.getMonth() === reminderDate.getMonth();
}

export const processReminders = async () => {
    console.log('PROCESS REMINDERS');

    await db.connect(dbConfig);
    const allCustomers = await db.findAll();
    const now = Date.now();

    allCustomers.forEach(async (customer) => {
        const sendEmailPromises = [];

        customer.reminders.forEach((reminder) => {
            if (isTimeToSend(reminder, now)) {
                sendEmailPromises.push(sendReminder(customer.email, { ...reminder }));
            }
        });

        await Promise.all(sendEmailPromises);
    });

    await await db.close();
    console.log('FINISH');
}
