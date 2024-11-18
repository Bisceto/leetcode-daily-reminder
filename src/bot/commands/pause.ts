import { Context } from "telegraf";
import { pauseNotifications } from "../../db/queries";
import { pool } from "../../config/connection";

export async function pauseCommand(ctx: Context) {
  if (ctx.chat) {
    const chatId = ctx.chat.id;
    await pauseNotifications(chatId, pool);
    await ctx.reply(
      "Notifications paused indefinitely. Use /resume to start receiving notifications again."
    );
  } else {
    console.error("Chat context is undefined");
  }
}
