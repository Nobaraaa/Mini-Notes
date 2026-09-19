import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  password: "zyna123",
  host: "localhost",
  port: 5432,
  database: "mini_notes",
});

export default pool;