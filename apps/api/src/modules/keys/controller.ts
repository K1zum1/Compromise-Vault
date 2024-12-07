import { existsSync } from 'fs';
import { join } from 'path';

import { apiResponse, errorResponse } from '@utils/apiResponse';
import AppError from '@utils/appError';

import { ExpressRequest, ExpressResponse } from '@/types/express';

import service from './service';
import { CreateKeyDto, ValidateKeyDto } from './types';
import { extractKeyType } from './util';
import crypto from 'crypto'; 

const create = async (req: ExpressRequest, res: ExpressResponse) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const referer = req.headers.referer || req.headers.referrer || '';
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
            .status(409)
            .json(errorResponse(new AppError('Key is exist', 409)));
    }

    const file = await service.create(body);

    service.generateKRL();

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

export const generateKRL = async (_: ExpressRequest, res: ExpressResponse) => {
    const path = join(__dirname, `../../../assets/keys/krl_combined.krl`);

    if (!existsSync(path)) {
        const generatePath = await service.generateKRL();

        if (!generatePath) {
            return res
                .status(400)
                .json(
                    errorResponse(new AppError('Error when generate the krl file', 400)),
                );
        }

        return res.download(generatePath);
    }

    res.download(path);
};

const computeFingerprint = (req: ExpressRequest, res: ExpressResponse) => {
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
};

export default { create, validate, generateKRL, computeFingerprint };