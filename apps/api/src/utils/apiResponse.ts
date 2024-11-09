import { ApiResponse } from '@/types/express';

export const apiResponse = <T>({
	data,
	errorCode = 0,
	errors = null,
	message,
}: ApiResponse<T>): ApiResponse<T> => {
	if (errorCode === 0) {
		message = message || 'Success';
	}

	return {
		errorCode,
		message,
		data,
		errors,
	};
};

export const errorResponse = ({
	data,
	errorCode = 500,
	errors,
	message,
	trace,
}: ApiResponse<null>): ApiResponse<null> => {
	if (errorCode === 0) {
		message = message || 'Fail';
	}

	return {
		errorCode,
		message,
		data,
		errors,
		trace,
	};
};
