import { batch, Component, createMemo, createSignal, onMount, Show } from 'solid-js';

import { Anime } from 'src/util/anime';
import { createTree, Tree } from 'src/util/tree';
import { Anime as AnimeComponent } from 'src/components/Anime';

import './play.scss';

interface Props {
	source: Anime[];
}

export const Play: Component<Props> = function (props) {
	const [list, setList] = createSignal<Anime[]>([]);

	// Bin Search and Insert
	const [tree, setTree] = createSignal<Tree>({ index: 0 });

	const challenger = createMemo<Anime>(() => list().at(tree()?.index || 0) || props.source[0]);
	const challengee = createMemo<Anime>(() => props.source[list().length]);

	const done = createMemo<boolean>(() => list().length === props.source.length);

	onMount(() => {
		if (props.source.length === 0) {
			console.error('List is empty.');
			return;
		}
		const initialList = [props.source[0]];
		// Initialize
		batch(() => {
			setList(initialList);
			setTree(createTree(list()) as Tree); // TODO: null safety
		});
	});

	function commit(above: boolean) {
		const t = tree();
		const next = above ? t.above : t.below;
		if (next) {
			setTree(next);
			return;
		}
		const l = list().slice();
		let pos = t.index;
		if (!above) pos += 1;
		l.splice(pos, 0, challengee());
		batch(() => {
			setList(l);
			setTree(createTree(list()) as Tree); // TODO: null safety
		});
	}

	return (
		<div class="view-play">
			<Show
				when={done()}
				fallback={
					<>
						<div class="current-duel">
							<AnimeComponent anime={challenger()} onClick={() => commit(false)} />
							<div class="vs">vs</div>
							<AnimeComponent anime={challengee()} onClick={() => commit(true)} />
						</div>
					</>
				}
			>
				<div>
					<p>Done.</p>
				</div>
			</Show>
		</div>
	);
};
