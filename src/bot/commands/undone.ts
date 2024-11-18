import { Context } from "telegraf";
import { markUndoneForToday } from "../../db/queries";
import { pool } from "../../config/connection";

export async function undoneCommand(ctx: Context) {
  if (ctx.chat) {
    const chatId = ctx.chat.id;
    await markUndoneForToday(chatId, pool);
    await ctx.reply(
      "Oh not done yet? No worries, today's notifications have been resumed!"
    );
  } else {
    console.error("Chat context is undefined");
  }
}
