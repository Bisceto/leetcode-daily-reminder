import { config } from "dotenv";
import { Pool } from "pg";
import OpenAI from "openai";

config();

export const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "development"
      ? process.env.DEVELOPMENT_DATABASE_URL
      : process.env.PRODUCTION_DATABASE_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });

export const testConnections = async () => {
  try {
    console.log("Testing database connection...");
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully!");

    console.log("Testing OpenAI connection...");
    await openai.models.list();
    console.log("OpenAI connected successfully!");
  } catch (error) {
    console.error("Failed to connect:", error);
    process.exit(1);
  }
};
