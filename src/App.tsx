import { batch, Component, createEffect, createSignal, Match, Switch } from 'solid-js';
import { clearGame, Game, loadGame } from 'src/game';
import { Anime } from 'src/util/anime';
import { loadOutput, saveOutput } from 'src/util/localStorage';
import { loadTokenFromUrl, Token } from 'src/util/token';
import { Export } from 'src/views/Export';

import { Play } from './views/Play';
import { Start, StartToken } from './views/Start';

export const App: Component = function () {
	const [game, setGame] = createSignal<Game | undefined>(loadGame());
	const [token] = createSignal<Token | undefined>(loadTokenFromUrl());
	const [output, setOutput] = createSignal<Anime[] | undefined>(loadOutput());

	createEffect(() => saveOutput(output()));

	function onDone(list: Anime[]) {
		batch(() => {
			setOutput(list);
			clearGame(setGame);
		});
		return;
	}

	return (
		<>
			<Switch fallback={<Start />}>
				<Match when={output() && token() && { o: output() as Anime[], t: token() as Token }} keyed>
					{({ o, t }) => <Export token={t} output={o} />}
				</Match>
				<Match when={game()} keyed>
					{(game) => <Play game={game} onDone={onDone} />}
				</Match>
				<Match when={token()} keyed>
					{(token) => <StartToken token={token} setGame={setGame} />}
				</Match>
			</Switch>
		</>
	);
};
