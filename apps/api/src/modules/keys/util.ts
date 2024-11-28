import { exec } from 'child_process';

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

export const execPromise = (command: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		exec(command, (error, _, stderr) => {
			if (error) {
				reject(new Error(stderr || `Error executing command: ${command}`));
			} else {
				resolve();
			}
		});
	});
};
