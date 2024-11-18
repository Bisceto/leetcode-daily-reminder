import { Context, Markup, Telegraf } from "telegraf";
import { getUser } from "../../db/queries";
import { formatCronToHour } from "../../utils/helpers";

export const editCommand = (bot: Telegraf) => {
  async function editReminderMenu(ctx: Context) {
    if (ctx.chat) {
      const user = await getUser(ctx.chat.id);
      const reminder_1 = user.rows[0].first_reminder;
      const reminder_2 = user.rows[0].second_reminder;
      await ctx.reply(
        `Which reminder would you like to edit?
      \nReminder one: ${formatCronToHour(reminder_1)}
      \nReminder two: ${formatCronToHour(reminder_2)}`,
        Markup.inlineKeyboard([
          Markup.button.callback("Reminder 1", "reminder_1"),
          Markup.button.callback("Reminder 2", "reminder_2"),
        ])
      );
    } else {
      console.error("Chat context is undefined");
    }
  }

  bot.command("edit", editReminderMenu);
  bot.action("back", editReminderMenu);

  // Function to split array into chunks
  function chunkArray(array: any[], size: number) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
      chunked_arr.push(array.slice(index, size + index));
      index += size;
    }
    return chunked_arr;
  }

  // Function to generate keyboard for a specific page
  function generateKeyboard(page: number) {
    const buttons = pages[page].map((hour: number) => {
      const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "pm" : "am";
      return Markup.button.callback(
        `${formattedHour}:00 ${period} UTC`,
        `0 ${hour} * * *` // This is the cron expression
      );
    });

    const navigationButtons = [];
    if (page > 0) {
      navigationButtons.push(
        Markup.button.callback("Previous", `page_${page - 1}`)
      );
    }
    if (page < pages.length - 1) {
      navigationButtons.push(
        Markup.button.callback("Next", `page_${page + 1}`)
      );
    }

    navigationButtons.push(Markup.button.callback("Back", `back`));

    // Chunk buttons into rows of 3
    const buttonRows = chunkArray(buttons, 3);

    // Add navigation buttons as the last row
    buttonRows.push(navigationButtons);

    return Markup.inlineKeyboard(buttonRows);
  }

  const pages = chunkArray([...Array(24).keys()], 12); // Change 5 to the number of buttons per page

  bot.action(/page_(\d+)/, async (ctx) => {
    const page = Number(ctx.match[1]);
    await ctx.editMessageText(
      "Select a new reminder time",
      generateKeyboard(page)
    );
    await ctx.answerCbQuery();
  });

  bot.action("reminder_1", async (ctx) => {
    // Handle editing of Reminder 1
    console.log("Editing Reminder 1");
    await ctx.reply("Select a new reminder time", generateKeyboard(0));
    await ctx.answerCbQuery();
  });

  bot.action("reminder_2", async (ctx) => {
    // Handle editing of Reminder 2
    console.log("Editing Reminder 2");
    await ctx.reply("Select a new reminder time", generateKeyboard(0));
    await ctx.answerCbQuery();
  });
};
