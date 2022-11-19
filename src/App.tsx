import { Component, createSignal, Show } from 'solid-js';

import { MediaFormat, MediaListStatus, MediaSeason } from 'src/generated/graphql';

import { Start } from './views/Start';
import { Play } from './views/Play';

import styles from './App.module.scss';

export interface Anime {
	status: MediaListStatus;
	progress: number;
	media: {
		title: {
			romaji: string;
			english?: string;
			native: string;
		};
		format: MediaFormat;
		episodes: number;
		season: MediaSeason;
		seasonYear: number;
		coverImage: {
			large: string;
		};
		siteUrl: string;
	};
}

export const App: Component = function () {
	const [list, setList] = createSignal<Anime[]>();
	return (
		<Show when={list()} fallback={<Start onStart={(l) => setList(l)} />} keyed>
			{(l) => <Play source={l} />}
		</Show>
	);
};
