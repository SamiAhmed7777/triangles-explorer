import { getBlock } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const block = await getBlock(params.hash);
		return { block };
	} catch {
		error(404, 'Block not found');
	}
};
