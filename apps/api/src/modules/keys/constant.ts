import { KeyPattern, KeyType } from './types';

export const KEY_MAP: Record<KeyPattern, KeyType> = {
	'ssh-rsa': 'RSA',
	'ssh-dss': 'DSA',
	'ssh-ed25519': 'ED25519',
	'ecdsa-sha2-nistp256': 'ECDSA',
	'ecdsa-sha2-nistp384': 'ECDSA',
	'ecdsa-sha2-nistp521': 'ECDSA',
};
