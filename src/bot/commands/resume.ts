import { Context } from "telegraf";
import { resumeNotifications } from "../../db/queries";

export async function resumeCommand(ctx: Context) {
  if (ctx.chat) {
    const chatId = ctx.chat.id;
    await resumeNotifications(chatId);
    await ctx.reply(
      "Notifications resumed indefinitely. Use /pause to stop receiving notifications."
    );
  } else {
    console.error("Chat context is undefined");
  }
}
