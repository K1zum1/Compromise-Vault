//#region IMPORT
import { RouteObject } from 'react-router-dom';

import { asyncPage } from '@/utils/asyncRoute';
//#endregion

export const homeRoutes: RouteObject = {
	path: '/',
	element: asyncPage(() => import('./pages/home')),
};
