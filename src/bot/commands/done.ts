import { Context } from "telegraf";
import { markDoneForToday } from "../../db/queries";

export async function doneCommand(ctx: Context) {
  if (ctx.chat) {
    const chatId = ctx.chat.id;
    await markDoneForToday(chatId);
    await ctx.reply(
      "You're done for today! Notifications will resume tomorrow."
    );
  } else {
    console.error("Chat context is undefined");
  }
}
