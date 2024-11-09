import { KEY_MAP } from './constant';
import { KeyPattern, KeyType } from './types';

export const extractKeyType = (pubKey: string): KeyType => {
	for (const pattern in KEY_MAP) {
		if (pubKey.startsWith(pattern as KeyPattern)) {
			return KEY_MAP[pattern as KeyPattern];
		}
	}

	return 'UNKNOWN';
};
