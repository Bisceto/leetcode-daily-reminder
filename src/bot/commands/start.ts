import type { Context } from "telegraf";
import { createUser } from "../../db/queries";
import { pool } from "../../config/connection";

export async function startCommand(ctx: Context) {
  if (ctx.chat) {
    const chatId = ctx.chat.id;
    // Insert new chatId into db
    createUser(chatId, pool);
    const startMessage = `
    Welcome to LeetCode Daily Reminder Bot! 
    \nThis bot can send you reminders and information about LeetCode's Daily Challenge.
    \nYou can use the following commands:
    \n /daily - Get information about today's challenge.
    \n /done - Stop receiving notifications for the day once you've completed today's challenge.
    \n /undone - Resume notifications for the day if you've not completed today's challenge.
    \n /pause - Pause all notifications indefinitely.
    \n /resume - Resume all notifications.
    \n /edit - Configure your reminders.
  `;
    await ctx.reply(startMessage);
  } else {
    console.error("Chat context is undefined");
  }
}
