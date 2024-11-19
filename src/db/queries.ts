import { Pool } from "pg";

export const createUser = async (chatId: number, db: Pool) => {
  const text = `INSERT INTO users(chat_id, reminder_1, reminder_2) VALUES($1, $2, $3) 
     ON CONFLICT (chat_id) DO NOTHING RETURNING *`;
  const values = [chatId, "0 6 * * *", "0 14 * * *"];
  return await db.query(text, values);
};

export const getUser = async (chatId: number, db: Pool) => {
  const text = "SELECT * FROM users WHERE chat_id = $1 LIMIT 1";
  const values = [chatId];
  return await db.query(text, values);
};

export const getUsersToNotify = async (db: Pool) => {
  const text = `SELECT * FROM users WHERE pause = false`;
  return await db.query(text);
};

export const getUsersToNotifyAtCurrentHour = async (db: Pool) => {
  // Get the current hour
  const currentHour = new Date().getHours();
  const currentHourCron = `0 ${currentHour} * * *`;

  // Query the database for users whose reminder_1 or reminder_2 matches the current hour
  const text = `SELECT * FROM users WHERE (reminder_1 = $1 OR reminder_2 = $1) AND pause = false AND done_for_today = false`;
  const values = [currentHourCron];
  return await db.query(text, values);
};

export const pauseNotifications = async (chatId: number, db: Pool) => {
  const text = "UPDATE users SET pause = true WHERE chat_id = $1 RETURNING *";
  const values = [chatId];
  const res = await db.query(text, values);
  return res;
};

export const resumeNotifications = async (chatId: number, db: Pool) => {
  const text = "UPDATE users SET pause = false WHERE chat_id = $1 RETURNING *";
  const values = [chatId];
  const res = await db.query(text, values);
  return res;
};

export const markDoneForToday = async (chatId: number, db: Pool) => {
  const text =
    "UPDATE users SET done_for_today = true WHERE chat_id = $1 RETURNING *";
  const values = [chatId];
  return await db.query(text, values);
};

export const markUndoneForToday = async (chatId: number, db: Pool) => {
  const text =
    "UPDATE users SET done_for_today = false WHERE chat_id = $1 RETURNING *";
  const values = [chatId];
  return await db.query(text, values);
};

export const resetDoneForToday = async (db: Pool) => {
  const text = "UPDATE users SET done_for_today = false";
  return await db.query(text);
};

export const updateUserReminder = async (
  chatId: number,
  cronExpression: string,
  reminder: number,
  db: Pool
) => {
  const column = `reminder_${reminder}`; // Determine the column based on the reminder
  const text = `UPDATE users SET ${column} = $2 WHERE chat_id = $1 RETURNING *`; // Use the column in the SQL query
  const values = [chatId, cronExpression];
  return await db.query(text, values);
};

// Mainly for testing
export const getAllUsers = async (db: Pool) => {
  const text = "SELECT * FROM users";
  const res = await db.query(text);
  return res;
};

//Dangerous! Only to be used in testing
export const clearUsers = async (db: Pool) => {
  const text = "DELETE FROM users";
  const res = await db.query(text);
  console.log("db cleared");
  return res;
};

// Uncomment to clear the db
// clearUsers();
