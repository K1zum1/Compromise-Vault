import { apiResponse, errorResponse } from '@utils/apiResponse';
import AppError from '@utils/appError';

import { ExpressRequest, ExpressResponse } from '@/types/express';

import service from './service';
import { CreateKeyDto, ValidateKeyDto } from './types';
import { extractKeyType } from './util';

const create = async (req: ExpressRequest, res: ExpressResponse) => {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	const userAgent = req.headers['user-agent'];
	const referer = req.headers.referer || req.headers.referrer;
	const keyType = extractKeyType(req.body.pubKey);
	const body = {
		...req.body,
		ipAddress: ip,
		userAgent,
		referer,
		keyType,
	} as CreateKeyDto;

	const exist = await service.getOne({
		where: {
			OR: [{ pubKey: body.pubKey }, { privKey: body.privKey }],
		},
	});

	if (exist) {
		return res
			.status(404)
			.json(errorResponse(new AppError('Key is exist', 404)));
	}

	const file = await service.create(body);

	const response = apiResponse({ data: file });

	return res.status(200).json(response);
};

const validate = async (req: ExpressRequest, res: ExpressResponse) => {
	const { privKey, pubKey } = req.body as ValidateKeyDto;

	const keyType = extractKeyType(pubKey);

	const { valid, error } = service.validate(keyType, privKey, pubKey);

	if (!valid) {
		return res.status(400).json(errorResponse(new AppError(error, 400)));
	}

	const response = apiResponse({
		data: {
			valid: true,
			fingerprintValidated: true,
		},
	});

	return res.status(200).json(response);
};

export default { create, validate };
