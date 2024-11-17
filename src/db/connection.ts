import { config } from "dotenv";
import { Pool } from "pg";

config();
const pool = new Pool({
  connectionString: process.env.DEVELOPMENT_DATABASE_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

(async () => {
  try {
    console.log("Testing database connection...");
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
})();

export default pool;
