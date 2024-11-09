import { RouteObject } from 'react-router-dom';

import HomePage from '@modules/home/pages/home';
import { homeRoutes } from '@modules/home/routes';

const routes: RouteObject[] = [
	{
		path: '/',
		element: <HomePage />,
		errorElement: <></>,
		children: [homeRoutes],
	},
];

export default routes;
