import { check } from 'express-validator';

import { validationError } from '@utils/validationError';

export const validateCreateKey = [
	check('privKey').not().isEmpty().withMessage('Private key must not be empty'),
	check('pubKey').not().isEmpty().withMessage('Public key must not be empty'),
	check('fingerprintValidated')
		.not()
		.isEmpty()
		.withMessage('Fingerprint validated must not be empty'),
	validationError,
];

export const validateValidateKey = [
	check('privKey').not().isEmpty().withMessage('Private key must not be empty'),
	check('pubKey').not().isEmpty().withMessage('Public key must not be empty'),
	validationError,
];
