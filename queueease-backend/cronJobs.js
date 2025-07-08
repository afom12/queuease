// cronJobs.js
const cron = require('node-cron');
const { sendNotification } = require('./utils/notificationUtil');
const Queue = require('./models/Queue');

// Cron job to send reminder 1 hour before appointment
cron.schedule('*/1 * * * *', async () => {
  const now = new Date();
  const reminderTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

  try {
    const queues = await Queue.find({
      appointmentDate: {
        $gte: now,
        $lte: reminderTime,
      },
      status: 'pending',
    }).populate('user', 'email name');

    for (const queue of queues) {
      const user = queue.user;
      const message = `Reminder: Your appointment for ${queue.serviceType} is in 1 hour at ${queue.appointmentDate}.`;

      sendNotification(user, message);
    }

    console.log('Reminder cron job executed');
  } catch (err) {
    console.error('Error in reminder cron job:', err);
  }
});
