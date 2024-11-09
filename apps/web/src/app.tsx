//#region IMPORT
import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PUBLIC_URL } from '@configs/_constant';

import routes from './routes';

import './app.css';
//#endregion

const router = createBrowserRouter(routes, { basename: PUBLIC_URL });

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

const App = () => {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<Suspense fallback={<>Loading...</>}>
					<RouterProvider router={router} />
				</Suspense>

				{/* <ReactQueryDevtools
					initialIsOpen={false}
					buttonPosition="bottom-left"
				/> */}
			</QueryClientProvider>
		</>
	);
};

export default App;
