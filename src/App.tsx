import { Component, createSignal, Show } from 'solid-js';

import { Start } from './views/Start';
import { Play } from './views/Play';
import { Anime } from 'src/util/anime';

export const App: Component = function () {
	const [source, setSource] = createSignal<Anime[]>();
	return (
		<Show when={source()} fallback={<Start onStart={(l) => setSource(l)} />} keyed>
			{(l) => <Play source={l} />}
		</Show>
	);
};
