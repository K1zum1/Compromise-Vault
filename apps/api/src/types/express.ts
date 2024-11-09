export type ExpressRequest = {
	headers: Record<string, string>;
	body: any;
	file: any;
	params: any;
	query: any;
	connection: any;
};

export type ExpressResponse = any;

export type ExpressNext = any;

export type ApiResponse<T> = {
	data: T | T[] | null;
	errorCode?: number;
	errors?: any;
	message?: string;
	trace?: any;
};
