import "dotenv/config";
import { Router } from 'express';
import { getTokenizer } from '../services/tokenizer';
import { toHiragana } from 'wanakana';
import { POS_MAP } from '../utils/posMap';
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const router = Router();

router.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;

        const tokenizer = await getTokenizer();
        const tokens = tokenizer.tokenize(text);

        for (const t of tokens) {
            const meaning = await pool.query(
                "SELECT meaning FROM jmdict WHERE kanji = $1",
                [t.surface_form]
            );
            
            t.meaning = meaning.rows[0].meaning;
        }

        const result = tokens.map(t => ({
            surface: t.surface_form,
            reading: t.reading ? toHiragana(t.reading) : '',
            pos: POS_MAP[t.pos] || t.pos,
            meaning: t.meaning
        }));

        return res.json({ tokens: result });
    } catch (err) {
        return res.status(500).json({ error: "Failed to tokenize" });
    }
});

export default router;