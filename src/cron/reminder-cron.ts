import cron from 'node-cron';
import { notificationsService } from '../modules/notifications/notifications.service';

process.env.NODE_CRON_SUPPRESS_WARNINGS = 'true';

export function startReminderCron() {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    // console.log('⏰ Cron tick');
    try {
      const due = await notificationsService.getDueReminders();
      // console.log('Due reminders found:', due.length);

      for (const reminder of due) {
        // In production: send email/push
        console.log(`🔔 Reminder: Event "${reminder.title}" is coming up!`);
      }
    } catch (error) {
      console.error('Reminder cron error:', error);
    }
  });
}