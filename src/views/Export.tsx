import './export.scss';

import { Component, createSignal, For, Show } from 'solid-js';
import { Spinner } from 'src/components/Spinner';
import { ExportMutationVariables } from 'src/generated/graphql';
import { Anime } from 'src/util/anime';
import { Token } from 'src/util/token';

interface Props {
	output: Anime[];
	token: Token;
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

export const Export: Component<Props> = function (props) {
	const [progress, setProgress] = createSignal<number>();
	const [progressMsg, setProgressMsg] = createSignal<string>();

	function calcScore(i: number): number {
		return Math.trunc((1 - i / props.output.length) * (maxScore - minScore) + minScore);
	}

	async function retryAfter(res?: Response): Promise<void> {
		const retryAfter = Number(res ? res.headers.get('retry-after') || defaultRetry : defaultRetry);
		setProgressMsg(`Rate Limit reached. Continuing in ${retryAfter} seconds.`);
		await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
	}

	async function onExport() {
		console.log('Exporting. This may take a few minutes due to rate limiting.');
		setProgress(0);
		const stack: Array<[number, Anime]> = props.output.map((a, i) => [i, a]);
		while (stack.length > 0) {
			const [i, anime] = stack.shift() as [number, Anime];
			setProgressMsg(`Exporting ${anime.media.title.romaji}`);
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

			if (!res.ok) {
				console.error(`Failed to update scores for ${anime.media.title.romaji}`);
			} else {
				console.log(`Successfully updated scores for ${anime.media.title.romaji}`);
			}

			setProgress((p) => (p || 0) + 1);

			// Handle rate limiting preflight next request
			const ratelimitRemaining = res.headers.get('x-ratelimit-remaining');
			if (stack.length > 0 && ratelimitRemaining !== null && ratelimitRemaining === '0') {
				await retryAfter(res);
			}
		}
		console.log('Export completed');
	}

	return (
		<div class="view-export">
			<Show
				when={progress() !== undefined}
				fallback={
					<button class="primary type-label-lg" onClick={onExport}>
						Export
					</button>
				}
			>
				<div class="progress">
					<div class="message">
						<Spinner />
						<p>{progressMsg()}</p>
					</div>
					<progress class="bar" max={props.output.length} value={progress() || 0} />
				</div>
			</Show>
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
					<For each={props.output}>
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
