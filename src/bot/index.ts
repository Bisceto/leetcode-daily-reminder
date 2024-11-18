import { Telegraf } from "telegraf";
import { config } from "dotenv";
import { setupCommands } from "./commands";
import { scheduleUserRemindersJob } from "./scheduler";
import { pool, testConnections } from "../config/connection";

config();

if (!process.env.TELEGRAM_TOKEN) {
  throw new Error("TELEGRAM_TOKEN is not defined in the environment variables");
}
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

setupCommands(bot);
scheduleUserRemindersJob(bot);
testConnections();
bot.launch();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing database connection...");
  await pool.end();
  console.log("Database connection closed. Bot shutting down...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Closing database connection...");
  await pool.end();
  console.log("Database connection closed. Bot shutting down...");
  process.exit(0);
});
