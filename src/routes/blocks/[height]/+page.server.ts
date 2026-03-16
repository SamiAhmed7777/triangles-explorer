import { getBlockByHeight } from '$lib/api';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const height = parseInt(params.height);
	const block = await getBlockByHeight(height);
	redirect(301, `/block/${block.hash}`);
};
