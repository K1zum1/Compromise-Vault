import axios from 'axios';
import { stringify } from 'querystring';

import { API_BASE_URL, API_TIMEOUT } from '@configs/_constant';

export const http = axios.create({
	baseURL: API_BASE_URL + '/api',
	timeout: API_TIMEOUT,
	paramsSerializer: {
		serialize: (params) => stringify(params),
	},
	validateStatus: (status) => status < 500,
});

export const isCancel = axios.isCancel;
