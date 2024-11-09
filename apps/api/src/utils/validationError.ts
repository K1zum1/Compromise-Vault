import { validationResult } from 'express-validator';

import { ExpressNext, ExpressRequest, ExpressResponse } from '@/types/express';

import AppError from './appError';

export const validationError = (
	req: ExpressRequest,
	res: ExpressResponse,
	next: ExpressNext,
) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res
			.status(400)
			.json(new AppError('Validation Error', 400, errors.array()));
	}
	next();
};
