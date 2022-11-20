import { Component, createSignal, Match, onMount, Switch } from 'solid-js';
import { ListQuery, ListQueryVariables } from 'src/generated/graphql';
import { Anime } from 'src/util/anime';
import { parseJWT } from 'src/util/jwt';
import { Export } from 'src/views/Export';

import { Play } from './views/Play';
import { Start } from './views/Start';

const query = /* GraphQL */ `
	query List($userId: Int!) {
		MediaListCollection(
			userId: $userId
			type: ANIME
			forceSingleCompletedList: true
			sort: SCORE_DESC
			status_not: PLANNING
		) {
			hasNextChunk
			lists {
				name
				isCustomList
				entries {
					id
					status
					progress
					media {
						title {
							romaji
							english
							native
						}
						format
						episodes
						season
						seasonYear
						coverImage {
							large
						}
						siteUrl
					}
				}
			}
		}
	}
`;

export const App: Component = function () {
	const [source, setSource] = createSignal<Anime[]>();
	const [list, setList] = createSignal<Anime[]>();
	const [accessToken, setAccessToken] = createSignal<string>();

	onMount(async () => {
		const params = new URLSearchParams(location.hash.substring(1));
		const accessToken = params.get('access_token');
		if (!accessToken) return;
		setAccessToken(accessToken);
		const jwt = parseJWT(accessToken);
		if (!jwt) return;

		const variables: ListQueryVariables = { userId: Number(jwt.sub) };

		const res = await fetch('https://graphql.anilist.co/', {
			method: 'POST',
			body: JSON.stringify({ query, variables }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok) {
			// TODO: Handle error properly
			console.error('Fetching List failed.');
			return;
		}

		const json = (await res.json()) as { data: ListQuery };
		const qryRes = json.data;
		if (qryRes.MediaListCollection?.hasNextChunk) {
			// TODO: Deal with lists with >500 entries later. (Show warning in the mean time)
			return;
		}
		const list = qryRes.MediaListCollection?.lists
			?.filter((l) => l && !l.isCustomList) // Don't include custom lists
			.map((l) => l?.entries) // Project entries
			.flat(); // Merge sublists into a single big list

		if (!list) {
			// TODO: Handle error properly
			console.error('Something went wrong. List is null.');
			return;
		}

		setSource(list as Anime[]);
	});

	function onDone(list: Anime[]) {
		setList(list);
		return;
	}

	return (
		<>
			<Switch fallback={<Start />}>
				<Match when={list()} keyed>
					{(list) => <Export list={list} accessToken={accessToken() as string} />}
				</Match>
				<Match when={source()} keyed>
					{(source) => <Play source={source} onDone={onDone} />}
				</Match>
			</Switch>
		</>
	);
};
