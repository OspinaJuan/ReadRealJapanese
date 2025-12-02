import "dotenv/config";
import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const JMDICT_FOLDER = path.join(process.cwd(), "/data/jmdict");
const PITCH_FOLDER = path.join(process.cwd(), "/data/pitch");

async function readAllJson() {
  const jmdict_files = await fs.readdir(JMDICT_FOLDER);
  const pitch_files = await fs.readdir(PITCH_FOLDER);

  const data = {
    "jmdict": [],
    "pitch": []
  };

  for (const file of jmdict_files) {
    const content = await fs.readFile(path.join(JMDICT_FOLDER, file), "utf8");
    data.jmdict.push(...JSON.parse(content));
  }

  for (const file of pitch_files) {
    const content = await fs.readFile(path.join(PITCH_FOLDER, file), "utf8");
    data.pitch.push(...JSON.parse(content));
  }

  return data;
}

async function insertAll(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const word of data.jmdict) {
      console.log(word);

      const found_pitches_array = [];
      const found_pitches = data.pitch.find(entry => entry[0] === word[0]);

      if (found_pitches) {
        for (const pitch_obj of found_pitches[2].pitches) {
          found_pitches_array.push(pitch_obj.position);
        }
      } else {
        found_pitches_array.push(null);
      }

      await client.query(
        `INSERT INTO jmdict (kanji, meaning, pitches) VALUES ($1, $2, $3)`,
        [word[0], word[5], found_pitches_array]
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