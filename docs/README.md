# LeetCode Daily Reminder Telegram Bot

This is a Telegram bot that sends daily reminders about the LeetCode's Daily Challenge. It is designed to help users keep track of their daily LeetCode challenges and manage their reminders.
You can access the bot using this link: [LeetCode Daily Reminder Bot](https://t.me/leetcode_daily_reminder_bot)

## Features

- Fetches the daily LeetCode challenge and caches it for quick access.
- Sends daily reminders to users about the LeetCode challenge.
- Allows users to pause and resume notifications.
- Allows users to mark a challenge as done for the day, stopping notifications for that day.
- Allows users to edit their reminder times.
- Supports multiple reminders per user.

## Commands

The bot supports the following commands:

- `/start`: Starts the bot and registers the user in the database.
- `/daily`: Fetches the daily LeetCode challenge.
- `/pause`: Pauses all notifications indefinitely.
- `/resume`: Resumes all notifications.
- `/done`: Marks the daily challenge as done for the day, stopping notifications for that day.
- `/undone`: Marks the daily challenge as not done, resuming notifications for that day.
- `/edit`: Allows the user to edit their reminder times.

## Codebase Overview

The codebase is organized into several main directories:

- `src/bot`: Contains the main bot logic and command handlers.
- `src/db`: Contains database queries.
- `src/services`: Contains services for fetching the daily LeetCode challenge.
- `src/utils`: Contains utility functions and helpers.
- `src/config`: Contains configuration files such as connections to postgresql and openAPI.
- `tests`: Contains test files.

The bot is built with TypeScript and utilizes PostgreSQL for its database. It employs the [`telegraf`](https://www.npmjs.com/package/telegraf) library for Telegram bot functionality. For fetching the daily LeetCode challenge, it uses the [`leetcode-query`](https://www.npmjs.com/package/leetcode-query) library.

The bot's main entry point is `src/bot/index.ts`. This file sets up the bot, registers the command handlers, and starts the bot.

The bot connects to the PostgreSQL database and OpenAI API via `src/config/connection.ts`.

The command handlers are located in `src/bot/commands`. Each command has its own file, and all commands are imported and set up in `src/bot/commands/index.ts`.

Database queries are located in `src/db/queries.ts`. These queries are used to interact with the PostgreSQL database.

The bot uses a simple in-memory cache to store the daily LeetCode challenge for quick access. The cache logic is located in `src/utils/cache.ts`.

The bot also uses a scheduler to send reminders to users and fetch the daily LeetCode challenge. The scheduler logic is located in `src/bot/scheduler.ts`.

## Tests

The bot includes a suite of tests located in the `tests` directory. The tests use Jest and cover the database queries and the cache.

## Setup

To set up the bot, you will need to provide your Telegram bot token and PostgreSQL connection string as environment variables. You can do this by following the .env.example file and creating a `.env` file in the root directory with the following variables:

```
TELEGRAM_TOKEN=your_telegram_bot_token
DEVELOPMENT_DATABASE_URL=your_postgresql_connection_string
```

Please refer to `database_schema.md` to view the table used. This project calls OpenAPI to summarise the daily challenge content. However, this is an extension and is not neccessary.

You can then install the dependencies and start the bot with the following commands:

```bash
npm install
npm start-dev
```

This bot was developed by Wesley Teo 2024.

## License

This project is licensed under the MIT License.
