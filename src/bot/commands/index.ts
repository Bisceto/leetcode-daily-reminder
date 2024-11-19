import { Telegraf } from "telegraf";
import { startCommand } from "./start";
import { dailyCommand } from "./daily";
import { pauseCommand } from "./pause";
import { resumeCommand } from "./resume";
import { doneCommand } from "./done";
import { editCommand } from "./edit";
import { undoneCommand } from "./undone";

export function setupCommands(bot: Telegraf) {
  bot.start(startCommand);
  bot.command("pause", pauseCommand);
  bot.command("resume", resumeCommand);
  bot.command("done", doneCommand);
  bot.command("undone", undoneCommand);

  editCommand(bot);
  dailyCommand(bot);
  bot.telegram.setMyCommands([
    {
      command: "daily",
      description: "Get today's LeetCode Challenge",
    },
    {
      command: "done",
      description:
        "Cancel today's notifications when you've completed today's challenge",
    },
    {
      command: "undone",
      description:
        "Resume today's notifications if you've not completed today's challenge",
    },
    {
      command: "pause",
      description: "Pause all notifications indefinitely",
    },
    {
      command: "resume",
      description: "Resume all notifications",
    },
    {
      command: "edit",
      description: "Configure your reminders",
    },
  ]);
  console.log("Bot has set up commands");
}
