import { Telegraf } from "telegraf";
import { config } from "dotenv";
import { setupCommands } from "./commands";
import { scheduleUserRemindersJob } from "./scheduler";
import { pool, testConnections } from "../config/connection";
import express from "express";

config();

if (!process.env.TELEGRAM_TOKEN) {
  throw new Error("TELEGRAM_TOKEN is not defined in the environment variables");
}
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

setupCommands(bot);
scheduleUserRemindersJob(bot);
testConnections();
bot.launch();

// Start express server
const app = express();
const port = process.env.PORT || 3000;
app.get("/", (_: express.Request, res: express.Response) => {
  res.send("Bot is running");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

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
