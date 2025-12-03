// import done by chatgpt, parsing the meaning being so inconsistent was really difficult for me to do

import "dotenv/config";
import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const JMDICT_FOLDER = path.join(process.cwd(), "/data/jmdict");
const PITCH_FOLDER = path.join(process.cwd(), "/data/pitch");
const MAX_ROWS_PER_INSERT = 20000; 

function parseMeaning(rawInput) {
  if (rawInput == null) return null;

  let root = rawInput;
  if (typeof root === "string") {
    try {
      root = JSON.parse(root);
    } catch (e) {
      return root;
    }
  }

  const candidates = Array.isArray(root) ? root : [root];

  function findGlossary(node) {
    if (!node || typeof node !== "object") return null;
    if (node.data && node.data.content === "glossary" && node.lang === "en") return node;
    if (node.content) {
      if (Array.isArray(node.content)) {
        for (const child of node.content) {
          const f = findGlossary(child);
          if (f) return f;
        }
      } else {
        const f = findGlossary(node.content);
        if (f) return f;
      }
    }
    for (const key of Object.keys(node)) {
      const val = node[key];
      if (val && typeof val === "object") {
        const f = findGlossary(val);
        if (f) return f;
      }
    }
    return null;
  }

  function extractText(node) {
    if (node == null) return "";
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractText).filter(Boolean).join(", ");
    if (typeof node === "object") {
      if (node.content !== undefined) return extractText(node.content);
      const parts = [];
      for (const key of Object.keys(node)) {
        const txt = extractText(node[key]);
        if (txt) parts.push(txt);
      }
      return parts.join(", ");
    }
    return String(node);
  }

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      for (const inner of candidate) {
        const g = findGlossary(inner);
        if (g) {
          const text = extractText(g.content).trim();
          if (text) return text;
        }
      }
    } else {
      const g = findGlossary(candidate);
      if (g) {
        const text = extractText(g.content).trim();
        if (text) return text;
      }
    }
  }

  function collectEnglishText(node, out) {
    if (!node) return;
    if (typeof node === "string") {
      out.push(node);
      return;
    }
    if (typeof node !== "object") return;
    if (node.lang === "en" && node.content) {
      out.push(extractText(node.content));
      return;
    }
    if (Array.isArray(node)) {
      for (const c of node) collectEnglishText(c, out);
      return;
    }
    for (const k of Object.keys(node)) collectEnglishText(node[k], out);
  }

  const fallback = [];
  for (const c of candidates) collectEnglishText(c, fallback);
  if (fallback.length) return fallback.join(", ").trim();

  try {
    return typeof rawInput === "string" ? rawInput : JSON.stringify(rawInput);
  } catch (_) {
    return String(rawInput);
  }
}


async function readAllJson() {
  const jmdict_files = await fs.readdir(JMDICT_FOLDER);
  const pitch_files = await fs.readdir(PITCH_FOLDER);

  const readFilesConcurrently = async (directory, files) => {
    const readPromises = files.map(async file => {
      const content = await fs.readFile(path.join(directory, file), "utf8");
      return JSON.parse(content);
    });
    return (await Promise.all(readPromises)).flat();
  };

  console.log("Reading JMDICT files concurrently...");
  const jmdict_data = await readFilesConcurrently(JMDICT_FOLDER, jmdict_files);

  console.log("Reading Pitch files concurrently...");
  const pitch_data = await readFilesConcurrently(PITCH_FOLDER, pitch_files);

  return { "jmdict": jmdict_data, "pitch": pitch_data };
}

async function insertAll(data) {
  console.log("Building pitch lookup map...");
  const pitchMap = new Map();
  for (const pitchEntry of data.pitch) {
    pitchMap.set(pitchEntry[0], pitchEntry);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const totalWords = data.jmdict.length;
    let wordsProcessed = 0;

    for (let i = 0; i < totalWords; i += MAX_ROWS_PER_INSERT) {
      const chunk = data.jmdict.slice(i, i + MAX_ROWS_PER_INSERT);
      const insertValues = [];
      const parameters = [];
      let paramIndex = 1;

      for (const word of chunk) {
        const found_pitches_array = [];
        const found_pitches = pitchMap.get(word[0]);
        if (found_pitches) {
          for (const pitch_obj of found_pitches[2].pitches) {
            found_pitches_array.push(pitch_obj.position);
          }
        }

        const plainMeaning = parseMeaning(word[5]);

        insertValues.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
        parameters.push(word[0], plainMeaning, found_pitches_array);
        wordsProcessed++;
      }

      if (insertValues.length > 0) {
        const queryText = `INSERT INTO jmdict (kanji, meaning, pitches) VALUES ${insertValues.join(", ")}`;
        console.log(`Inserting chunk ${Math.ceil((i / MAX_ROWS_PER_INSERT) + 1)}... (${wordsProcessed}/${totalWords})`);
        await client.query(queryText, parameters);
      }
    }

    await client.query("COMMIT");
    console.log("Transaction committed successfully.");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Transaction failed:", err);
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    const data = await readAllJson();
    await insertAll(data);
    console.log("✅ Import finished successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error during import.");
    process.exit(1);
  }
}

main();