/* eslint-disable react-refresh/only-export-components */
import { createElement, lazy, Suspense } from 'react';

export function asyncLayout(factory: () => Promise<{ default: any }>) {
	const Layout = lazy(factory);

	return createElement(
		Suspense,
		{ fallback: <>Loading...</> },
		createElement(Layout, {}),
	);
}

export function asyncPage(factory: () => Promise<{ default: any }>) {
	const Page = lazy(factory);

	return createElement(Page, {});
}
