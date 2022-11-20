import './export.scss';

import { Component, For } from 'solid-js';
import { ExportMutationVariables } from 'src/generated/graphql';
import { Anime } from 'src/util/anime';

interface Props {
	list: Anime[];
	accessToken: string;
}

const minScore = 0;
const maxScore = 100;

const query = /* GraphQL */ `
	mutation Export($id: Int!, $score: Int!) {
		SaveMediaListEntry(id: $id, scoreRaw: $score) {
			id
		}
	}
`;

const defaultRetry = 60;
async function retryAfter(res?: Response): Promise<void> {
	const retryAfter = Number(res ? res.headers.get('retry-after') || defaultRetry : defaultRetry);
	console.warn(`Rate Limit reached. Continuing in ${retryAfter} seconds.`);
	await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
}

export const Export: Component<Props> = function (props) {
	function calcScore(i: number): number {
		return Math.trunc((1 - i / props.list.length) * (maxScore - minScore) + minScore);
	}

	async function onExport() {
		console.log('Exporting. This may take a few minutes due to rate limiting.');
		const stack: Array<[number, Anime]> = props.list.map((a, i) => [i, a]);
		while (stack.length > 0) {
			const [i, anime] = stack.shift() as [number, Anime];
			const variables: ExportMutationVariables = {
				id: anime.id,
				score: calcScore(i),
			};

			// Fetch at least once; Retry as long as result returns "Too Many Requests"
			// (This should usually succeed right away)
			let res: Response | undefined;
			while (!res || res.status === 429) {
				try {
					res = await fetch('https://graphql.anilist.co/', {
						method: 'POST',
						body: JSON.stringify({ query, variables }),
						headers: {
							Authorization: `Bearer ${props.accessToken}`,
							'Content-Type': 'application/json',
						},
					});
					// Break early if status is NOT "Too Many Requests"
					if (res.status !== 429) {
						break;
					}
					// Delay next loop
					await retryAfter(res);
				} catch (err) {
					console.warn(err);
				} finally {
					if (!res) {
						await retryAfter(res);
					}
				}
			}

			// Make TypeScript happy
			if (!res) {
				console.error('Unreachable Code'); // Covered by previous while loop
				return;
			}

			// Handle rate limiting preflight next request
			const ratelimitRemaining = res.headers.get('x-ratelimit-remaining');
			if (stack.length > 0 && ratelimitRemaining !== null && ratelimitRemaining === '0') {
				await retryAfter(res);
			}

			if (!res.ok) {
				console.error(`Failed to update scores for ${anime.media.title.romaji}`);
			}
		}
		console.log('Export completed');
	}

	return (
		<div class="view-export">
			<button class="primary type-label-lg" onClick={onExport}>
				Export
			</button>
			<table role="list" class="list">
				<thead>
					<tr>
						<th>
							<p class="type-title-sm">Score</p>
						</th>
						<th>
							<p class="type-title-sm">Rank</p>
						</th>
						<th>
							<p class="type-title-sm">Title</p>
						</th>
					</tr>
				</thead>
				<tbody>
					<For each={props.list}>
						{(anime, i) => (
							<tr>
								<td class="score">
									<p class="mono">{calcScore(i())}</p>
								</td>
								<td class="rank">
									<p class="mono">{i() + 1}</p>
								</td>
								<td class="title">
									<p>{anime.media.title.romaji}</p>
								</td>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
};
