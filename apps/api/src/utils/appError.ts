import { APP_ENV } from "@configs/_constant";

class AppError extends Error {
	public errors: any;
	public data: null;
	public errorCode: number;
	public trace: any;

	constructor(message: any, errorCode?: number, errors?: any) {
		super();

		// Set the prototype explicitly.
		Object.setPrototypeOf(this, new.target.prototype);

		this.data = null;
		this.errorCode = errorCode || 500;
		this.message = message;

		if (typeof message === 'object') {
			this.message = message?.message || JSON.stringify(message);
		}

		const error = new Error(this.message);

		this.errors = errors || error.message;

		if (APP_ENV === 'development') {
			this.trace = error.stack;
		}
	}
}

export default AppError;
