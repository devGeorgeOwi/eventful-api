import app from './app';
import { env } from './config/env';
import { startReminderCron } from './cron/reminder-cron';

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  startReminderCron();
});

