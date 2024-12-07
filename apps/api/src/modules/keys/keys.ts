import express, { Request, Response } from 'express';
import crypto from 'crypto';

const router = express.Router();

router.post('/fingerprint', (req: Request, res: Response) => {
    const { pubKey } = req.body;

    if (!pubKey) {
        return res.status(400).json({ error: 'Public key is required' });
    }

    try {
        const fingerprint = crypto.createHash('md5').update(pubKey).digest('hex');
        return res.json({ fingerprint });
    } catch (error) {
        console.error('Error computing fingerprint:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;