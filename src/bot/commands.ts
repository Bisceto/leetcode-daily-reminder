import { Telegraf } from "telegraf";
import { getChallengeInformation } from "../services/leetcode";
import {
  createUser,
  markDoneForToday,
  pauseNotifications,
  resumeNotifications,
} from "../db/queries";

export function setupCommands(bot: Telegraf) {
  bot.start(async (ctx) => {
    const chatId = ctx.chat.id;
    // Insert new chatId into db
    createUser(chatId);
    if (process.env.NODE_ENV === "development") {
      console.log("Running in development mode");
    } else if (process.env.NODE_ENV === "production") {
      console.log("Running in production mode");
    }
    const startMessage = `
      Welcome to LeetCode Daily Reminder Bot! 
      \nThis bot sends you a reminder whenever LeetCode's Daily Challenge has reset! Use /daily to get today's challenge.
      \nIn addition, you can configure extra reminders to remind yourself to finish today's challenge! Use /edit_reminder to configure your preferences.
      \nUse /done to stop receiving notifications for the day.
    `;
    await ctx.reply(startMessage);
  });

  bot.command("daily", async (ctx) => {
    const dailyChallengeMessage = await getChallengeInformation();
    await ctx.reply(dailyChallengeMessage);
  });

  bot.command("pause", async (ctx) => {
    const chatId = ctx.chat.id;
    await pauseNotifications(chatId);
    await ctx.reply(
      "Notifications paused indefinitely. Use /resume to start receiving notifications again."
    );
  });

  bot.command("resume", async (ctx) => {
    const chatId = ctx.chat.id;
    await resumeNotifications(chatId);
    await ctx.reply(
      "Notifications resumed indefinitely. Use /pause to stop receiving notifications."
    );
  });

  bot.command("edit", async (ctx) => {
    //Do a conversation with a markup keyboard.
  });

  bot.command("done", async (ctx) => {
    const chatId = ctx.chat.id;
    await markDoneForToday(chatId);
    await ctx.reply(
      "You're done for today! Notifications will resume tomorrow."
    );
  });

  // bot.on(message("text"), async (ctx) => {
  //   // Explicit usage
  //   // await ctx.telegram.sendMessage(
  //   //   ctx.message.chat.id,
  //   //   `Hello ${ctx.state.role}`
  //   // );

  //   // Using context shortcut
  //   // await ctx.reply(`Hello ${ctx.state.role} using shortcut`);
  //   await ctx.reply(content);
  // });

  bot.on("callback_query", async (ctx) => {
    // Explicit usage
    await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

    // Using context shortcut
    await ctx.answerCbQuery();
  });

  bot.on("inline_query", async (ctx) => {
    const result: any[] = [];
    // Explicit usage
    await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

    // Using context shortcut
    await ctx.answerInlineQuery(result);
  });
}
