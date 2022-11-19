import { Component, createSignal, Match, Show, Switch } from 'solid-js';

import { Start } from './views/Start';
import { Play } from './views/Play';
import { Anime } from 'src/util/anime';
import { Export } from 'src/views/Export';

export const App: Component = function () {
	const [source, setSource] = createSignal<Anime[]>();
	const [list, setList] = createSignal<Anime[]>();

	function onDone(list: Anime[]) {
		setList(list);
		return;
	}

	return (
		<>
			<Switch fallback={<Start onStart={(s) => setSource(s)} />}>
				<Match when={list()} keyed>
					{(list) => <Export list={list} />}
				</Match>
				<Match when={source()} keyed>
					{(source) => <Play source={source} onDone={onDone} />}
				</Match>
			</Switch>
		</>
	);
};
