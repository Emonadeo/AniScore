import { Component } from 'solid-js';
import { ListQuery, ListQueryVariables } from 'generated/graphql';

import './start.scss';

const query = /* GraphQL */ `
	query List($username: String!) {
		MediaListCollection(
			userName: $username
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

async function onSubmit(e: SubmitEvent) {
	e.preventDefault();
	if (!e.target) return;
	const form = e.target as HTMLFormElement;
	const input = form.elements.namedItem('username') as HTMLInputElement;
	const username = input.value;

	const variables: ListQueryVariables = { username };

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

	const json = await res.json();
	const qryRes = json.data as ListQuery;
	if (qryRes.MediaListCollection?.hasNextChunk) {
		// TODO: Deal with lists with >500 entries later. (Show warning in the mean time)
		return;
	}
	const list = qryRes.MediaListCollection?.lists
		?.filter((l) => l && !l?.isCustomList) // Don't include custom lists
		.map((l) => l?.entries) // Project entries
		.flat(); // Merge sublists into a single big list

	if (!list) {
		// TODO: Handle error properly
		console.error('Something went wrong. List is null.');
		return;
	}

	console.log(list);
}

export const Start: Component = function () {
	return (
		<form onSubmit={onSubmit}>
			<p class="disclaimer">Not affiliated with AniList</p>
			<div class="title">
				<h1 class="type-h1">Ani</h1>
				<h1 class="type-h1 rounded primary">Score</h1>
			</div>
			<p>Generate AniList Scores by playing "Would you rather?"</p>
			<input class="type-label-lg" name="username" type="text" placeholder="Username" required />
			<button class="type-label-lg">Go!</button>
		</form>
	);
};
