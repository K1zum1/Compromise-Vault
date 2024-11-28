import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const getDirs = (path: string): string[] => {
	if (!existsSync(path)) {
		return [];
	}

	const dirs: string[] = [];

	const _resources = readdirSync(path);

	_resources.forEach((_resource) => {
		const resourcePath = join(path, _resource);
		const resourceStat = statSync(resourcePath);

		if (resourceStat.isDirectory()) {
			dirs.push(resourcePath);
		}
	});

	return dirs;
};

export { getDirs };
