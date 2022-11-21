import './start.scss';

import {
	Component,
	createEffect,
	createResource,
	Match,
	ResourceFetcher,
	Setter,
	Switch,
} from 'solid-js';
import { createGame, Game } from 'src/game';
import { Anime } from 'src/util/anime';
import { parseToken, Token } from 'src/util/token';
import { ListQuery, ListQueryVariables } from 'src/generated/graphql';

const clientId = '10128';

export const Start: Component = function () {
	return (
		<div class="view-start">
			<p class="disclaimer">Not affiliated with AniList</p>
			<div class="title">
				<h1 class="type-h1">Ani</h1>
				<h1 class="type-h1 rounded primary">Score</h1>
			</div>
			<p>Generate AniList Scores by playing "Would you rather?"</p>
			<a
				class="button primary type-label-lg"
				href={`https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`}
			>
				Login with AniList
			</a>
		</div>
	);
};

// StartToken

interface Props {
	token: Token;
	setGame: Setter<Game>;
}

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

const fetchSource: ResourceFetcher<Token, Anime[]> = async function (token): Promise<Anime[]> {
	const variables: ListQueryVariables = { userId: token.data.sub };
	const res = await fetch('https://graphql.anilist.co/', {
		method: 'POST',
		body: JSON.stringify({ query, variables }),
		headers: {
			Authorization: `Bearer ${token.str}`,
			'Content-Type': 'application/json',
		},
	});

	if (!res.ok) {
		throw Error('Fetching List failed.');
	}

	const json = (await res.json()) as { data: ListQuery };
	const qryRes = json.data;
	if (qryRes.MediaListCollection?.hasNextChunk) {
		// TODO: Deal with lists with >500 entries later. (Show warning in the mean time)
		throw Error('List too large. Currently only lists with <=500 entries are supported.');
	}
	const list = qryRes.MediaListCollection?.lists
		?.filter((l) => l && !l.isCustomList) // Don't include custom lists
		.map((l) => l?.entries) // Project entries
		.flat(); // Merge sublists into a single big list

	if (!list) {
		throw Error('Something went wrong. List is null.');
	}

	return list as Anime[];
};

export const StartToken: Component<Props> = function (props) {
	const [source] = createResource<Anime[], Token>(() => props.token, fetchSource);

	createEffect(() => {
		const src = source();
		if (src) props.setGame(createGame(src));
	});

	return (
		<div>
			<Switch>
				<Match when={source.loading}>
					<p>Loading List.</p>
				</Match>
				<Match when={source.error} keyed>
					{(err) => <p>Error: {err}</p>}
				</Match>
			</Switch>
		</div>
	);
};
