import bodyParse from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import listEndpoints from 'express-list-endpoints';
import morgan from 'morgan';
import { join } from 'path';

import { APP_PORT } from '@configs/_constant';

import AppError from '@utils/appError';

dotenv.config({ debug: true });

const boostrap = async () => {
	console.log('Boostrap....');

	const rootRouter = (await import('./modules/router')).default;

	const PORT = APP_PORT || 3001;

	const app = express();

	app.use(express.json());
	app.use(morgan('dev'));
	app.use(cors());

	app.use(bodyParse.raw());
	app.use(bodyParse.json());
	app.use(bodyParse.urlencoded({ extended: false }));

	app.use('/public', express.static(join(__dirname, '../public')));

	app.use('/api', rootRouter);

	// Log all routes
	console.log('Registered Routes:');
	console.log(listEndpoints(app));

	app.all('*', (req, _, next) => {
		next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
	});

	const server = app.listen(PORT, () =>
		console.log(`Running on port ${PORT} ⚡`),
	);

	server.on('error', (err: any) => {
		if (err.code === 'EADDRINUSE') {
			console.log(
				`Port ${PORT} is already in use. Please try a different port.`,
			);
		} else {
			console.error('Server error:', err);
		}
	});
};

boostrap();
