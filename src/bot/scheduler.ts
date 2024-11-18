import { Telegraf } from "telegraf";
import { CronJob } from "cron";
import { getDailyChallenge } from "../services/leetcode";
import {
  getUsersToNotify,
  getUsersToNotifyAtCurrentHour,
  resetDoneForToday,
} from "../db/queries";
import { calculateSecondsUntilMidnightUTC } from "../utils/helpers";
import { pool } from "../config/connection";

// Schedule a CRON job to fetch the daily challenge at 00:00 UTC
export const fetchDailyChallengeJob = new CronJob(
  "0 0 * * *",
  async () => {
    try {
      await getDailyChallenge();
      console.log(
        `${new Date().toUTCString()}: Successfully fetched and cached the daily LeetCode question}`
      );
    } catch (e) {
      console.error(
        `${new Date().toUTCString()}: Failed to fetch and cache the daily LeetCode question.`
      );
    }
  },
  null,
  true,
  "UTC"
);

export const sendDailyChallengeJob = (bot: Telegraf) => {
  new CronJob(
    "0 0 * * *",
    async () => {
      try {
        const users = await getUsersToNotify(pool);
        for (const user of users.rows) {
          bot.telegram.sendMessage(
            user.chat_id,
            `A new LeetCode challenge is out! Use /daily to get today's question.`
          );
        }
        console.log(
          `${new Date().toUTCString()}: Successfully sent daily challenge reminder`
        );
      } catch (e) {
        console.error(
          `${new Date().toUTCString()}: Failed to send daily challenge reminder.`
        );
      }
    },
    null,
    true,
    "UTC"
  );
};

export const resetDoneForTodayJob = new CronJob(
  "0 0 * * *",
  async () => {
    try {
      await resetDoneForToday(pool);
      console.log(
        `${new Date().toUTCString()}: Successfully reset done_for_today for all users.`
      );
    } catch (e) {
      console.error(
        `${new Date().toUTCString()}:  to reset done_for_today for all users.`
      );
    }
  },
  null,
  true,
  "UTC"
);

//Schedule a CRON job to send reminders to selected users every hour.
export const scheduleUserRemindersJob = (bot: Telegraf) => {
  new CronJob(
    "0 * * * *",
    async () => {
      try {
        const selectedUsers = await getUsersToNotifyAtCurrentHour(pool);
        //Parameter should be the time
        const hours = calculateSecondsUntilMidnightUTC() / 3600;
        for (const user of selectedUsers.rows) {
          bot.telegram.sendMessage(
            user.chat_id,
            `Don't forget to finish today's LeetCode Challenge ending in ${hours} hours!`
          );
        }
      } catch (e) {
        console.error("Failed to send notifications to users");
      }
    },
    null,
    true,
    "UTC"
  );
};
