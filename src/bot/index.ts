import { Telegraf } from "telegraf";
import { config } from "dotenv";
import { setupCommands } from "./commands";
import { scheduleUserRemindersJob } from "./scheduler";
import pool from "../db/connection";
import { getAllUsers } from "../db/queries";

config();

if (!process.env.TELEGRAM_TOKEN) {
  throw new Error("TELEGRAM_TOKEN is not defined in the environment variables");
}
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
setupCommands(bot);

scheduleUserRemindersJob(bot);

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
