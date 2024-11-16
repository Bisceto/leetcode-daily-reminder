import { Markup, Telegraf } from "telegraf";
import { getDailyChallenge } from "../services/leetcode";

export function setupCommands(bot: Telegraf) {
  bot.command("start", async (ctx) => {
    const startMessage = `
      Welcome to LeetCode Daily Reminder Bot! 
      This bot can do the following:
      1. Fetch the daily challenge from LeetCode. Use the /daily command to get today's challenge.
      2. Configure when you want to receive notifications about the daily challenge. Use the /edit_reminder command to edit your reminders.
    `;
    await ctx.reply(startMessage);
  });

  bot.command("daily", async (ctx) => {
    const dailyChallengeMessage = await getDailyChallenge();
    await ctx.reply(dailyChallengeMessage);
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
