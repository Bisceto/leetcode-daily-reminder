import { Context } from "telegraf";
import { pauseNotifications } from "../../db/queries";

export async function pauseCommand(ctx: Context) {
  if (ctx.chat) {
    const chatId = ctx.chat.id;
    await pauseNotifications(chatId);
    await ctx.reply(
      "Notifications paused indefinitely. Use /resume to start receiving notifications again."
    );
  } else {
    console.error("Chat context is undefined");
  }
}
