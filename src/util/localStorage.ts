/**
 * @file Manager for persistent data stored in {@link window.localStorage}
 */

import { Anime } from 'src/util/anime';
import { Tree } from 'src/util/tree';

const keySource = 'source';
const keyList = 'list';
const keyTree = 'tree';
const keyProgress = 'progress';
const keyLocalProgress = 'local_progress';
const keyOutput = 'output';

export function saveSource(source: Anime[] | undefined): void {
	saveJson<Anime[]>(keySource, source);
}

export function saveList(list: Anime[][] | undefined): void {
	saveJson<Anime[][]>(keyList, list);
}

export function saveTree(tree: Tree | undefined): void {
	saveJson<Tree>(keyTree, tree);
}

export function saveProgress(progress: number | undefined): void {
	saveJson<number>(keyProgress, progress);
}

export function saveLocalProgress(localProgress: number | undefined): void {
	saveJson<number>(keyLocalProgress, localProgress);
}

export function saveOutput(output: Anime[][] | undefined): void {
	saveJson<Anime[][]>(keyOutput, output);
}

export function loadSource(): Anime[] | undefined {
	return loadJson<Anime[]>(keySource);
}

export function loadList(): Anime[][] | undefined {
	return loadJson<Anime[][]>(keyList);
}

export function loadTree(): Tree | undefined {
	return loadJson<Tree>(keyTree);
}

export function loadProgress(): number | undefined {
	return loadJson<number>(keyProgress);
}

export function loadLocalProgress(): number | undefined {
	return loadJson<number>(keyLocalProgress);
}

export function loadOutput(): Anime[][] | undefined {
	return loadJson<Anime[][]>(keyOutput);
}

function loadJson<T>(key: string): T | undefined {
	const str = localStorage.getItem(key);
	if (!str) return undefined;
	try {
		return JSON.parse(str) as T;
	} catch (err) {
		return undefined;
	}
}

function saveJson<T>(key: string, value: T | undefined): void {
	if (value === undefined) {
		localStorage.removeItem(key);
	}
	localStorage.setItem(key, JSON.stringify(value));
}
