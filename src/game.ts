import { Accessor, createEffect, createMemo, createRoot, createSignal, Setter } from 'solid-js';
import { Anime } from 'src/util/anime';
import {
	loadList,
	loadLocalProgress,
	loadProgress,
	loadSource,
	loadTree,
	saveList,
	saveLocalProgress,
	saveProgress,
	saveSource,
	saveTree,
} from 'src/util/localStorage';
import { createTree, Tree } from 'src/util/tree';

export interface Game {
	source: Accessor<Anime[]>;
	setSource: Setter<Anime[]>;
	list: Accessor<Anime[][]>;
	setList: Setter<Anime[][]>;
	tree: Accessor<Tree>;
	setTree: Setter<Tree>;
	progress: Accessor<number>;
	setProgress: Setter<number>;
	maxProgress: Accessor<number>;
	localProgress: Accessor<number>;
	setLocalProgress: Setter<number>;
	maxLocalProgress: Accessor<number>;
}

export function loadGame(): Game | undefined {
	return createRoot(() => {
		const source = loadSource();
		const list = loadList();
		const tree = loadTree();
		const progress = loadProgress();
		const localProgress = loadLocalProgress();

		if (!source || !list || !tree || progress === undefined || localProgress === undefined) {
			return undefined;
		}

		return createGame(source, list, tree, progress, localProgress);
	});
}

export function createGame(
	source: Anime[],
	list: Anime[][] = [[source[0]]],
	tree: Tree = createTree([[source[0]]]) as Tree,
	progress = 0,
	localProgress = 0
): Game {
	return createRoot(() => {
		const [getSource, setSource] = createSignal<Anime[]>(source);
		const [getList, setList] = createSignal<Anime[][]>(list);
		const [getTree, setTree] = createSignal<Tree>(tree);
		const [getProgress, setProgress] = createSignal<number>(progress);
		const [getLocalProgress, setLocalProgress] = createSignal<number>(localProgress);

		const maxProgress = createMemo<number>(() => {
			let sum = 0;
			for (let i = 2; i < getSource().length; i++) {
				sum += Math.ceil(Math.log2(i));
			}
			return sum;
		});
		const maxLocalProgress = createMemo<number>(() =>
			Math.ceil(Math.log2(getList().flat().length))
		);

		createEffect(() => saveSource(getSource()));
		createEffect(() => saveList(getList()));
		createEffect(() => saveTree(getTree()));
		createEffect(() => saveProgress(getProgress()));
		createEffect(() => saveLocalProgress(getLocalProgress()));

		return {
			source: getSource,
			setSource,
			list: getList,
			setList,
			tree: getTree,
			setTree,
			progress: getProgress,
			setProgress,
			maxProgress,
			localProgress: getLocalProgress,
			setLocalProgress,
			maxLocalProgress,
		};
	});
}

export function clearGame(setGame: Setter<Game | undefined>) {
	setGame();
	// Clear local storage
	saveSource(undefined);
	saveList(undefined);
	saveTree(undefined);
	saveProgress(undefined);
	saveLocalProgress(undefined);
}
