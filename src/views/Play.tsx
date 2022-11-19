import {
	batch,
	Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	onMount,
	Show,
} from 'solid-js';

import { Anime as A } from 'src/App';
import { Anime } from 'src/components/Anime';

import './play.scss';

interface Props {
	source: A[];
}

interface Tree {
	// anime: A;
	index: number;
	above?: Tree;
	below?: Tree;
}

function createTree(partialList: A[], offset = 0): Tree | undefined {
	if (partialList.length === 0) return undefined;
	const center = Math.trunc(partialList.length / 2);
	return {
		index: offset + center,
		above: createTree(partialList.slice(0, center), offset),
		below: createTree(partialList.slice(center + 1), offset + center + 1),
	};
}

export const Play: Component<Props> = function (props) {
	const [list, setList] = createSignal<A[]>([]);

	// Bin Search and Insert
	const [tree, setTree] = createSignal<Tree | undefined>(undefined);

	const challenger = createMemo<A>(() => list().at(tree()?.index || 0) || props.source[0]);
	const challengee = createMemo<A>(() => props.source[list().length]);

	const done = createMemo<boolean>(() => list().length === props.source.length);

	onMount(() => {
		// Initialize list
		batch(() => {
			setList([props.source[0]]);
			setTree(createTree(list()));
		});
	});

	function commit(above: boolean) {
		const t = tree();
		if (!t) {
			console.error('Tree is undefined. This should never happen!');
			return;
		}
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
			setTree(createTree(list()));
		});
	}

	return (
		<div class="view-play">
			<Show
				when={done()}
				fallback={
					<>
						<div class="current-duel">
							<Anime anime={challenger()} onClick={() => commit(false)} />
							<div class="vs">vs</div>
							<Anime anime={challengee()} onClick={() => commit(true)} />
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
