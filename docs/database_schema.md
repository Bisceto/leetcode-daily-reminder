# Database Schema

This document describes the schema of the `users` table in our database.

## Table: users

| Column Name    | Data Type | Description                                                             |
| -------------- | --------- | ----------------------------------------------------------------------- |
| chat_id        | BIGINT    | The ID of the chat. This is also the primary key of the table.          |
| reminder_1     | STRING    | The cron expression for the first reminder.                             |
| reminder_2     | STRING    | The cron expression for the second reminder.                            |
| pause          | BOOLEAN   | A flag indicating whether notifications are paused for this user.       |
| done_for_today | BOOLEAN   | A flag indicating whether the user has completed their tasks for today. |

### Primary Key

The primary key of the `users` table is `chat_id`.

### Notes

- The `reminder_1` and `reminder_2` columns store cron expressions that determine when reminders should be sent to the user.
- The `pause` column is used to pause all notifications for a user. When `pause` is `true`, no notifications will be sent to the user.
- The `done_for_today` column is used to track whether the user has completed their tasks for the day. When `done_for_today` is `true`, no more reminders will be sent to the user for the rest of the day.

[`users` Schema](./src/db/leetcode_daily_reminder_schema.sql)
