import { Telegraf } from "telegraf";
import { getDailyChallenge } from "../services/leetcode";

export function setupCommands(bot: Telegraf) {
  bot.command("quit", async (ctx) => {
    // Explicit usage
    await ctx.telegram.leaveChat(ctx.message.chat.id);

    // Using context shortcut
    await ctx.leaveChat();
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
