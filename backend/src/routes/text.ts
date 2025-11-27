import { Router } from 'express';
import { convertToHiragana } from '../services/textService';

const router = Router();

router.post('/hiragana', async (req, res) => {
    try {
        const { text } = req.body;
        const result = await convertToHiragana(text);
        return res.json({ result });
    } catch (err) {
        return res.status(500).json({ error: "failed" });
    }
});

export default router;