import { Context } from "telegraf";
import { resumeNotifications } from "../../db/queries";
import { pool } from "../../config/connection";

export async function resumeCommand(ctx: Context) {
  if (ctx.chat) {
    const chatId = ctx.chat.id;
    await resumeNotifications(chatId, pool);
    await ctx.reply(
      "Notifications resumed indefinitely. Use /pause to stop receiving notifications."
    );
  } else {
    console.error("Chat context is undefined");
  }
}
