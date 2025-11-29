import "dotenv/config";
import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const FOLDER = path.join(process.cwd(), "/data");

async function readAllJson() {
  const files = await fs.readdir(FOLDER);

  const data = [];

  for (const file of files) {
    const content = await fs.readFile(path.join(FOLDER, file), "utf8");
    data.push(...JSON.parse(content));
  }

  return data;
}

async function insertAll(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const word of data) {
      console.log(word[5]);
      await client.query(
        `INSERT INTO jmdict (kanji, meaning) VALUES ($1, $2)`,
        [word[0], word[5]]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
  } finally {
    client.release();
  }
}

async function main() {
  const data = await readAllJson();
  await insertAll(data);
  console.log("Import finished.");
  process.exit(0);
}

main();