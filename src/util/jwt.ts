export interface JWT {
	aud: string;
	jti: string;
	iat: number;
	nbf: number;
	exp: number;
	sub: number;
}

export function parseJWT(jwt: string): JWT | undefined {
	try {
		return JSON.parse(atob(jwt.split('.')[1]));
	} catch {
		console.error(`Invalid JWT.`);
		return undefined;
	}
}
