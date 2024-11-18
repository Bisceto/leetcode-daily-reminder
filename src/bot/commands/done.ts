import { Context } from "telegraf";
import { markDoneForToday } from "../../db/queries";
import { pool } from "../../config/connection";

export async function doneCommand(ctx: Context) {
  if (ctx.chat) {
    const chatId = ctx.chat.id;
    await markDoneForToday(chatId, pool);
    await ctx.reply(
      "Great job, you're done for today! Notifications will resume tomorrow."
    );
  } else {
    console.error("Chat context is undefined");
  }
}
