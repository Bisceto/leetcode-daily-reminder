import { query } from "./connection";

export const createUser = async (chatId: number) => {
  const text = `INSERT INTO users(chat_id, first_reminder, second_reminder) VALUES($1, $2, $3) 
     ON CONFLICT (chat_id) DO NOTHING RETURNING *`;
  const values = [chatId, "0 14 * * *", "0 20 * * *"];
  return await query(text, values);
};

export const getUsersToNotifyAtCurrentHour = async () => {
  // Get the current hour
  const currentHour = new Date().getHours();

  // Create a CRON expression for the current hour
  const currentHourCron = `0 ${currentHour} * * *`;

  // Query the database for users whose first_reminder or second_reminder matches the current hour
  const text = `SELECT * FROM users WHERE (first_reminder = $1 OR second_reminder = $1) AND pause = false AND done_for_today = false`;
  const values = [currentHourCron];
  return await query(text, values);
};

export const pauseNotifications = async (chatId: number) => {
  const text = "UPDATE users SET pause = true WHERE chat_id = $1 RETURNING *";
  const values = [chatId];
  const res = await query(text, values);
  console.log("pause notifications for chatId", chatId);
  return res;
};

export const resumeNotifications = async (chatId: number) => {
  const text = "UPDATE users SET pause = false WHERE chat_id = $1 RETURNING *";
  const values = [chatId];
  const res = await query(text, values);
  console.log("resume notifications for chatId", chatId);
  return res;
};

export const markDoneForToday = async (chatId: number) => {
  const text =
    "UPDATE users SET done_for_today = true WHERE chat_id = $1 RETURNING *";
  const values = [chatId];
  return await query(text, values);
};

export const resetDoneForToday = async () => {
  const text = "UPDATE users SET done_for_today = false";
  return await query(text);
};

export const getAllUsers = async () => {
  const text = "SELECT * FROM users";
  const res = await query(text);
  return res;
};

export const deleteUser = async (chatId: number) => {
  const text = "DELETE FROM users WHERE id = $1 RETURNING *";
  const values = [chatId];
  return await query(text, values);
};

//Dangerous! Only to be used in testing
export const clearUsers = async () => {
  const text = "DELETE FROM users";
  const res = await query(text);
  console.log("db cleared");
  return res;
};

// Uncomment to clear the db
// clearUsers();
