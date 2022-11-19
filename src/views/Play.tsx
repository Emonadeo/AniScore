import { batch, Component, createMemo, createSignal, For, onMount, Show } from 'solid-js';

import { Anime as A } from 'src/App';
import { Anime } from 'src/components/Anime';

import './play.scss';

interface Props {
	source: A[];
}

export const Play: Component<Props> = function (props) {
	const [list, setList] = createSignal<A[]>([]);

	// Bin Search and Insert
	const [steps, setSteps] = createSignal<number>(0);
	const [challengerIndex, setChallengerIndex] = createSignal<number>(0);
	const maxSteps = createMemo<number>(() => Math.floor(Math.log2(list().length)) + 1);

	const challenger = createMemo<A>(() => list()[challengerIndex()] || props.source[0]);
	const challengee = createMemo<A>(() => props.source[list().length]);

	const done = createMemo<boolean>(() => list().length === props.source.length);

	onMount(() => {
		// Initialize list
		batch(() => {
			setList([props.source[0]]);
			setChallengerIndex(Math.floor(list().length / 2));
		});
	});

	function commit(up: boolean) {
		const anime = props.source[list().length];
		const pos = challengerIndex() + (up ? 0 : 1);
		console.log(`Challenger Index: ${challengerIndex()}`);
		console.log(`Inserting ${anime.media.title.romaji} into index ${pos}`);
		const l = list().slice();
		l.splice(pos, 0, challengee());
		console.log(`Resetting Challenger Index: ${Math.floor(list().length / 2)}`);
		batch(() => {
			setList(l);
			setSteps(0);
			setChallengerIndex(Math.floor(list().length / 2));
		});
	}

	function pushStep(up: boolean) {
		setSteps(steps() + 1);

		if (steps() >= maxSteps()) {
			commit(up);
			return;
		}

		let diff = Math.max(Math.floor(list().length / Math.pow(2, steps() + 1)), 1);
		if (up) diff *= -1;
		console.log(`Diff: ${diff}`);
		const nci = challengerIndex() + diff;
		console.log(`New Challenger: ${list()[nci]?.media.title.romaji} (${nci})`);
		if (nci < 0 || nci >= list().length) {
			console.log(`New Challenger out of bounds. Skipping.`);
			commit(up);
			return;
		}
		setChallengerIndex(nci);
		return;
	}

	return (
		<div class="view-play">
			<Show
				when={done()}
				fallback={
					<>
						<div class="current-duel">
							<Anime anime={challenger()} onClick={() => pushStep(false)} />
							<div class="vs">vs</div>
							<Anime anime={challengee()} onClick={() => pushStep(true)} />
						</div>
					</>
				}
			>
				<div>
					<p>Done.</p>
				</div>
			</Show>
			<div class="debug">
				<ol role="list">
					<For each={list()}>
						{(a) => (
							<li>
								<p>{a.media.title.romaji}</p>
							</li>
						)}
					</For>
				</ol>
			</div>
		</div>
	);
};
