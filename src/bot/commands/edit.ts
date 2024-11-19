import { Context, Markup, Telegraf } from "telegraf";
import { getUser, updateUserReminder } from "../../db/queries";
import { formatCronToHour } from "../../utils/helpers";
import { pool } from "../../config/connection";

export const editCommand = (bot: Telegraf) => {
  async function editReminderMenu(ctx: Context, back = false) {
    if (ctx.chat) {
      const user = await getUser(ctx.chat.id, pool);
      const reminder_1 = user.rows[0].reminder_1;
      const reminder_2 = user.rows[0].reminder_2;
      const messageText = `Which reminder would you like to edit?
    \nReminder one: ${formatCronToHour(reminder_1)}
    \nReminder two: ${formatCronToHour(reminder_2)}`;
      const keyboard = Markup.inlineKeyboard([
        Markup.button.callback("Reminder 1", "reminder_1"),
        Markup.button.callback("Reminder 2", "reminder_2"),
        Markup.button.callback("Cancel", "cancel"),
      ]);

      if (back) {
        await ctx.editMessageText(messageText, keyboard);
      } else {
        await ctx.reply(messageText, keyboard);
      }
    } else {
      console.error("Chat context is undefined");
    }
  }
  bot.command("edit", (ctx) => editReminderMenu(ctx));
  bot.action("back", (ctx) => editReminderMenu(ctx, true));
  bot.action("cancel", async (ctx) => {
    if (ctx.chat) {
      await ctx.deleteMessage();
    } else {
      console.error("Chat context is undefined");
    }
  });
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
  function generateKeyboard(page: number, reminder: number) {
    const buttons = pages[page].map((hour: number) => {
      const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "pm" : "am";
      return Markup.button.callback(
        `${formattedHour}:00 ${period} UTC`,
        `reminder_${reminder}_0 ${hour} * * *` // Add the reminder identifier to the cron expression
      );
    });

    const navigationButtons = [];
    if (page > 0) {
      navigationButtons.push(
        Markup.button.callback(
          "Previous",
          `page_${page - 1}_reminder_${reminder}`
        )
      );
    }
    if (page < pages.length - 1) {
      navigationButtons.push(
        Markup.button.callback("Next", `page_${page + 1}_reminder_${reminder}`)
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
    const reminder = Number(ctx.match[2]);
    await ctx.editMessageText(
      "Select a new reminder time",
      generateKeyboard(page, reminder)
    );
    await ctx.answerCbQuery();
  });

  bot.action("reminder_1", async (ctx) => {
    // Handle editing of Reminder 1
    await ctx.editMessageText(
      "Select a new reminder time",
      generateKeyboard(0, 1)
    );
    await ctx.answerCbQuery();
  });

  bot.action("reminder_2", async (ctx) => {
    // Handle editing of Reminder 2
    await ctx.editMessageText(
      "Select a new reminder time",
      generateKeyboard(0, 2)
    );
    await ctx.answerCbQuery();
  });

  bot.action(/reminder_1_0 (\d+) \* \* \*/, async (ctx) => {
    if (ctx.chat) {
      const hour = ctx.match[1];
      const cronExpression = `0 ${hour} * * *`;

      // Update reminder 1 in the database
      await updateUserReminder(ctx.chat.id, cronExpression, 1, pool);

      await ctx.reply("Your first reminder has been updated.");
    } else {
      console.error("Chat context is undefined");
    }
  });

  bot.action(/reminder_2_0 (\d+) \* \* \*/, async (ctx) => {
    if (ctx.chat) {
      const hour = ctx.match[1];
      const cronExpression = `0 ${hour} * * *`;

      // Update reminder 2 in the database
      await updateUserReminder(ctx.chat.id, cronExpression, 2, pool);

      await ctx.reply("Your second reminder has been updated.");
    } else {
      console.error("Chat context is undefined");
    }
  });
};
