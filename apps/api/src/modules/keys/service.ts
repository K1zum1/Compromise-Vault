import { Keys, Prisma, PrismaClient } from '@prisma/client';
import {
	existsSync,
	mkdirSync,
	promises as fs,
	unlinkSync,
	writeFileSync,
} from 'fs';
import { join } from 'path';
import { parseKey, parsePrivateKey } from 'sshpk';

import { CreateKeyDto, KeyType } from './types';
import { execPromise } from './util';

const prisma = new PrismaClient({
	errorFormat: 'minimal',
});

export const getOne = async (query: Prisma.KeysFindFirstArgs) => {
	return await prisma.keys.findFirst(query);
};

export const saveKey = async (key: Keys) => {
	const dirKeyPath = join(__dirname, `../../../assets/keys/${key.id}`);

	if (!existsSync(dirKeyPath)) {
		mkdirSync(dirKeyPath, { recursive: true });
	}

	const pubKeyPath = join(dirKeyPath, `pub.pem`);
	const privKeyPath = join(dirKeyPath, `priv.pem`);

	writeFileSync(pubKeyPath, key.pubKey);
	writeFileSync(privKeyPath, key.privKey.replace(/\\n/g, '\n'));
};

export const create = async (dto: CreateKeyDto) => {
	const parsedPubKey = parseKey(dto.pubKey, 'ssh');

	const privRegex =
		/-----BEGIN (.*?) PRIVATE KEY-----([\s\S]*?)-----END \1 PRIVATE KEY-----/;

	const transformedPubKey = dto.pubKey.replace(parsedPubKey.comment || '', '');
	const transformedPrivKey = dto.privKey.match(privRegex)?.[0].trim() || '';

	const newRecord = await prisma.keys.create({
		data: {
			...dto,
			pubKey: transformedPubKey,
			privKey: transformedPrivKey,
		},
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
	} catch (err: any) {
		return { valid: false, error: err.message };
	}
};

export const generateKRL = async (): Promise<string> => {
	const keys = await prisma.keys.findMany();

	const pubKeys = keys.map((key) => key.pubKey);

	if (pubKeys.length === 0) return '';

	const keyPath = `../../../assets/keys`;
	const krlFilePath = join(__dirname, keyPath, 'krl_combined.krl');

	const getKrl = async (): Promise<string> => {
		existsSync(krlFilePath) && unlinkSync(krlFilePath);

		const command = `ssh-keygen -k -f ${krlFilePath}`;

		await execPromise(command);

		for (const key of keys) {
			const keyFilePath = join(__dirname, keyPath, `temp-${Date.now()}.pub`);
			console.log('Key File Path', keyFilePath);
			await fs.writeFile(keyFilePath, key.pubKey);

			try {
				await execPromise(`ssh-keygen -k -u -f ${krlFilePath} ${keyFilePath}`);
			} catch (error) {
				throw new Error(`Error adding key to KRL: ${error}`);
			} finally {
				await fs.unlink(keyFilePath);
			}
		}

		return krlFilePath;
	};

	return await getKrl();
};

export default { getOne, create, validate, saveKey, generateKRL };
