import { Prisma, PrismaClient } from '@prisma/client';
import { parseKey, parsePrivateKey } from 'sshpk';

import { CreateKeyDto, KeyType } from './types';

const prisma = new PrismaClient({
	errorFormat: 'minimal',
});

export const getOne = async (query: Prisma.KeysFindFirstArgs) => {
	return await prisma.keys.findFirst(query);
};

export const create = async (dto: CreateKeyDto) => {
	const newRecord = await prisma.keys.create({
		data: { ...dto },
	});

	return newRecord;
};

export const validate = (
	type: KeyType,
	privKey: string,
	pubKey: string,
	passphrase?: string,
): { valid: boolean; error: string | null } => {
	try {
		const parsedPubKey = parseKey(pubKey, 'ssh');
		const parsedPrivKey = parsePrivateKey(privKey, 'pem', { passphrase });

		if (parsedPrivKey.type.toString() === type) {
			return {
				valid: false,
				error: 'The type not same type with the private key',
			};
		}

		const publicFromPrivate = parsedPrivKey.toPublic();
		const privKeyFingerprint = publicFromPrivate
			.fingerprint('sha256')
			.toString();

		const pubKeyFingerprint = parsedPubKey.fingerprint('sha256').toString();

		if (privKeyFingerprint !== pubKeyFingerprint) {
			return {
				valid: false,
				error: 'Fingerprint mismatch between private and public keys.',
			};
		}

		return { valid: true, error: '' };
	} catch (err) {
		return { valid: false, error: JSON.stringify(err) };
	}
};

export default { getOne, create, validate };
