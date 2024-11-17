import { Telegraf } from "telegraf";
import { CronJob } from "cron";
import { getDailyChallenge } from "../services/leetcode";
import {
  getUsersToNotifyAtCurrentHour,
  resetDoneForToday,
} from "../db/queries";

// Schedule a CRON job to fetch the daily challenge at 00:00 UTC
export const fetchDailyChallengeJob = new CronJob(
  "0 0 * * *",
  async () => {
    try {
      await getDailyChallenge();
      console.log(
        "Successfully fetched and cached the daily LeetCode question."
      );
    } catch (e) {
      console.error("Failed to fetch and cache the daily LeetCode question.");
    }
  },
  null,
  true,
  "UTC"
);

export const resetDoneForTodayJob = new CronJob(
  "0 0 * * *",
  async () => {
    try {
      await resetDoneForToday();
      console.log("Successfully reset done_for_today for all users.");
    } catch (e) {
      console.error("Failed to reset done_for_today for all users.");
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
        const selectedUsers = await getUsersToNotifyAtCurrentHour();
        //Parameter should be the time
        for (const user of selectedUsers.rows) {
          bot.telegram.sendMessage(user.chat_id, "Reminder sent");
        }
      } catch (e) {
        console.error("Failed to send notifications to users");
      }
    },
    null,
    true,
    "UTC" //Might have to figure out how to settle this to the device's timezone
  );
};
