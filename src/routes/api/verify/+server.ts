import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

/**
 * POST /api/verify
 * Body: { address: string, signature: string, message: string }
 * Returns: { valid: boolean, error?: string }
 *
 * Calls the Triangles daemon's verifymessage via JSON-RPC.
 */
export const POST: RequestHandler = async ({ request }) => {
	let body: { address?: string; signature?: string; message?: string };
	try {
		body = await request.json();
	} catch {
		error(400, 'Invalid JSON body');
	}

	const { address, signature, message } = body;
	if (!address || !signature || !message) {
		error(400, 'Missing required fields: address, signature, message');
	}

	const rpcUrl = env.TRIANGLES_RPC_URL || 'http://127.0.0.1:19112';
	const rpcUser = env.TRIANGLES_RPC_USER || 'trianglesrpc';
	const rpcPassword = env.TRIANGLES_RPC_PASSWORD || '';

	if (!rpcPassword) {
		console.error('[api/verify] TRIANGLES_RPC_PASSWORD not set');
		error(500, 'RPC credentials not configured');
	}

	const auth = Buffer.from(`${rpcUser}:${rpcPassword}`).toString('base64');

	try {
		const rpcRes = await fetch(rpcUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${auth}`
			},
			body: JSON.stringify({
				jsonrpc: '1.0',
				id: 'verify',
				method: 'verifymessage',
				params: [address, signature, message]
			})
		});

		// Read body regardless of status — Triangles daemon returns JSON-RPC errors
		// as HTTP 500 with a valid JSON body.
		const rpcJson = await rpcRes.json().catch(() => null);
		if (!rpcJson) {
			console.error(`[api/verify] RPC HTTP ${rpcRes.status} with non-JSON body`);
			error(502, `Upstream RPC error: ${rpcRes.status}`);
		}

		if (rpcJson.error) {
			return json({ valid: false, error: rpcJson.error.message || String(rpcJson.error) });
		}
		return json({ valid: rpcJson.result === true });
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		console.error(`[api/verify] ${msg}`);
		error(500, msg);
	}
};
