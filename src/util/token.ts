/**
 * @file Helper functions for parsing JSON Web Tokens
 */

export interface Token {
	str: string;
	data: {
		aud: string;
		jti: string;
		iat: number;
		nbf: number;
		exp: number;
		sub: number;
	};
}

export function parseToken(str: string): Token | undefined {
	try {
		const data = JSON.parse(atob(str.split('.')[1]));
		return { str, data };
	} catch {
		console.error(`Invalid JWT.`);
		return undefined;
	}
}

export function loadTokenFromUrl(): Token | undefined {
	const params = new URLSearchParams(location.hash.substring(1));
	const str = params.get('access_token');
	if (!str) {
		return undefined;
	}
	return parseToken(str);
}
