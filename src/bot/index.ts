import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { config } from "dotenv";
import { setupCommands } from "./commands";
import { getDailyChallenge } from "../services/leetcode";

config();

// const user = await leetcode.user("username");
if (!process.env.TELEGRAM_TOKEN) {
  throw new Error("TELEGRAM_TOKEN is not defined in the environment variables");
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

setupCommands(bot);

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
