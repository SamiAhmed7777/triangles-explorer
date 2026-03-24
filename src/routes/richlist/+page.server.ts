import { getRichList, getRichListStatus } from '$lib/api';

export async function load() {
	try {
		const [richlist, status] = await Promise.all([
			getRichList(100),
			getRichListStatus()
		]);
		
		return {
			richlist: richlist.addresses || [],
			status: richlist.status,
			total: richlist.total || 0,
			scannerStatus: status
		};
	} catch (error) {
		console.error('Rich list fetch error:', error);
		return {
			richlist: [],
			status: 'error',
			total: 0,
			scannerStatus: {
				status: 'error',
				lastProcessedBlock: 0,
				chainHeight: 0,
				progress: 0,
				totalAddresses: 0,
				lastUpdate: new Date().toISOString()
			},
			error: error instanceof Error ? error.message : 'Failed to load rich list'
		};
	}
}
