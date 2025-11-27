import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
    const { text } = req.body;
    console.log('Received text for analysis:', text);
    return res.json({
        analyzedText: [
            { surface: '日本語', reading: 'にほんご', meaning: 'Japanese language', pos: 'noun' },
            { surface: 'を', reading: 'を', meaning: 'object marker', pos: 'particle' },
            { surface: '勉強', reading: 'べんきょう', meaning: 'study', pos: 'noun' },
            { surface: 'します', reading: 'します', meaning: 'to do', pos: 'verb' }
        ]
    });
});

export default router;