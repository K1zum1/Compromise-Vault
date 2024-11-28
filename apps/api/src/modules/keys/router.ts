import express from 'express';

import controller from './controller';
import { validateCreateKey, validateValidateKey } from './validator';

const router = express.Router();

router.get('/krl', controller.generateKRL);

router.post('/', validateCreateKey, controller.create);
router.post('/validate', validateValidateKey, controller.validate);

export default router;
