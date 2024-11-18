import {
  createUser,
  getUser,
  getUsersToNotify,
  pauseNotifications,
  resumeNotifications,
  markDoneForToday,
  resetDoneForToday,
  updateUserReminder,
  getAllUsers,
  clearUsers,
} from "../../src/db/queries";
import { pool } from "../../src/config/connection";

describe("Database queries", () => {
  let chatId: number;

  beforeAll(async () => {
    // Clear the test database
    await clearUsers(pool);

    // Create a new user
    const user = await createUser(123456, pool);
    chatId = user.rows[0].chat_id;
  });

  test("createUser", async () => {
    const user = await createUser(789012, pool);
    expect(Number(user.rows[0].chat_id)).toBe(789012);
  });

  test("getUser", async () => {
    const user = await getUser(chatId, pool);
    expect(user.rows[0].chat_id).toBe(chatId);
  });

  test("getUsersToNotify", async () => {
    const users = await getUsersToNotify(pool);
    expect(users.rows.length).toBeGreaterThan(0);
  });

  test("pauseNotifications", async () => {
    const user = await pauseNotifications(chatId, pool);
    expect(user.rows[0].pause).toBe(true);
  });

  test("resumeNotifications", async () => {
    const user = await resumeNotifications(chatId, pool);
    expect(user.rows[0].pause).toBe(false);
  });

  test("markDoneForToday", async () => {
    const user = await markDoneForToday(chatId, pool);
    expect(user.rows[0].done_for_today).toBe(true);
  });

  test("resetDoneForToday", async () => {
    await resetDoneForToday(pool);
    const users = await getAllUsers(pool);
    users.rows.forEach((user) => {
      expect(user.done_for_today).toBe(false);
    });
  });

  test("updateUserReminder", async () => {
    const user = await updateUserReminder(chatId, "0 6 * * *", 1, pool);
    expect(user.rows[0].reminder_1).toBe("0 6 * * *");
  });

  test("getAllUsers", async () => {
    const users = await getAllUsers(pool);
    expect(users.rows.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    // Clear the test database
    await clearUsers(pool);
  });
});
