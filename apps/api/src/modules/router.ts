import express from 'express';

import keyRouter from './keys/router';

const router = express.Router();

router.use('/keys', keyRouter);

export default router;
