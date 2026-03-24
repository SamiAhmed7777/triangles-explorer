import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const start = Date.now();
	const response = await resolve(event);
	const duration = Date.now() - start;
	
	console.log(`[${response.status}] ${event.request.method} ${event.url.pathname} (${duration}ms)`);
	
	return response;
};
