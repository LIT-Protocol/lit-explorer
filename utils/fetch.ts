import { VESUVIUS_APP_CONFIG } from "../app_config";

/**
 * Fetch action code by a given IPFS ID
 * @param ipfsId
 * @returns { string } void
 */
export const fetchActionCode = async (ipfsId: string): Promise<string> => {
	console.log("[fetchActionCode] input<ipfsId>:", ipfsId);

	const API = `${VESUVIUS_APP_CONFIG.IPFS_PATH}/${ipfsId}`;
	console.log("[fetchActionCode] converted<API>:", API);

	let code: string;
	try {
		code = await fetch(API).then((res) => res.text());
		console.log("[fetchActionCode] output<code>:", code);
	} catch (e: any) {
		throw new Error("[fetchActionCode] error:", e.message);
	}

	return code;
};
