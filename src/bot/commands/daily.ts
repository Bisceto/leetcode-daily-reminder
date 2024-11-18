import { Context } from "telegraf";
import { getChallengeInformation } from "../../services/leetcode";

export async function dailyCommand(ctx: Context) {
  const dailyChallengeMessage = await getChallengeInformation();
  await ctx.reply(dailyChallengeMessage);
}
