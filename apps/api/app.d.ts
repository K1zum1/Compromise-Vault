declare global {
	namespace NodeJS {
		interface ProcessEnv {
			APP_ENV: 'development' | 'production';
			APP_PORT: number;
			DATABASE_URL: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
