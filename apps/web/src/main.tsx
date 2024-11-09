import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from './app.tsx';

ReactDOM.createRoot(document.getElementById('app')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
