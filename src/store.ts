import { createMemo, createRoot, createSignal } from 'solid-js';
import { parseToken, Token } from 'src/util/token';

function createToken() {
	const [token, setToken] = createSignal<string>();
	const tokenBody = createMemo<Token | undefined>(() => {
		const t = token();
		if (!t) return;
		return parseToken(t);
	});
	return { token, setToken, tokenBody };
}

export const { token, setToken, tokenBody } = createRoot(createToken);
