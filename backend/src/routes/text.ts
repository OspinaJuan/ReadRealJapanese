import { Router } from 'express';
import { getTokenizer } from '../services/tokenizer';
import { toHiragana } from 'wanakana';
import { POS_MAP } from '../utils/posMap';

const router = Router();

router.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;

        const tokenizer = await getTokenizer();
        const tokens = tokenizer.tokenize(text);

        const result = tokens.map(t => ({
            surface: t.surface_form,
            reading: t.reading ? toHiragana(t.reading) : '',
            pos: POS_MAP[t.pos] || t.pos,
            meaning: "N/A"
        }));

        return res.json({ tokens: result });
    } catch (err) {
        return res.status(500).json({ error: "Failed to tokenize" });
    }
});

export default router;