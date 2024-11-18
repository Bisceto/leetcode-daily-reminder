import type { Context } from "telegraf";
import { createUser } from "../../db/queries";

export async function startCommand(ctx: Context) {
  if (ctx.chat) {
    const chatId = ctx.chat.id;
    // Insert new chatId into db
    createUser(chatId);
    const startMessage = `
    Welcome to LeetCode Daily Reminder Bot! 
    \nThis bot sends you a reminder whenever LeetCode's Daily Challenge has reset! Use /daily to get today's challenge.
    \nIn addition, you can configure extra reminders to remind yourself to finish today's challenge! Use /edit_reminder to configure your preferences.
    \nUse /done to stop receiving notifications for the day.
  `;
    await ctx.reply(startMessage);
  } else {
    console.error("Chat context is undefined");
  }
}
