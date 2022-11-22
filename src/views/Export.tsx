import './export.scss';

import { Component, createSignal, For, Setter, Show } from 'solid-js';
import { Spinner } from 'src/components/Spinner';
import { ExportMutationVariables } from 'src/generated/graphql';
import { Anime } from 'src/util/anime';
import { Token } from 'src/util/token';

import iconMerge from 'src/assets/merge.svg';
import iconSplit from 'src/assets/split.svg';

interface Props {
	output: Anime[][];
	setOutput: Setter<Anime[][]>; // Setter needed for moving list items
	token: Token;
	onClear: () => void;
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

	function onClear() {
		if (!confirm('Are you sure you want to clear the list?')) {
			return;
		}
		props.onClear();
	}

	async function onExport() {
		console.log('Exporting. This may take a few minutes due to rate limiting.');
		setProgress(0);
		const stack: Array<[number, Anime]> = [];
		props.output.forEach((tiedAnimes, i) => {
			tiedAnimes.forEach((anime) => stack.push([i, anime]));
		});
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
							Authorization: `Bearer ${props.token.str}`,
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

	function move(index: number, up: boolean) {
		if ((index === 0 && up) || (index === props.output.length - 1 && !up)) {
			return;
		}
		const l = props.output.slice();
		const [tiedAnimes] = l.splice(index, 1);
		l.splice(up ? index - 1 : index + 1, 0, tiedAnimes);
		props.setOutput(l);
	}

	function merge(tiedAnimesIndex: number) {
		const l = props.output.slice();
		const [[anime]] = l.splice(tiedAnimesIndex, 1);
		l[tiedAnimesIndex - 1].push(anime);
		props.setOutput(l);
	}

	function split(tiedAnimesIndex: number, innerIndex: number) {
		const l = props.output.slice();
		const tiedAnimes = l[tiedAnimesIndex].splice(innerIndex, 1);
		l.splice(tiedAnimesIndex + 1, 0, tiedAnimes);
		props.setOutput(l);
	}

	return (
		<div class="view-export">
			<h1 class="rounded">This is your new List.</h1>
			<Show
				when={progress() !== undefined}
				fallback={
					<div class="actions">
						<button class="danger type-label-lg" onClick={onClear}>
							Clear
						</button>
						<button class="primary type-label-lg" onClick={onExport}>
							Export
						</button>
					</div>
				}
			>
				<div class="progress">
					<div class="message">
						<Spinner />
						<p>{progressMsg()}</p>
					</div>
					<progress class="bar" max={props.output.flat().length} value={progress() || 0} />
				</div>
			</Show>
			<table role="list" class="list">
				<thead>
					<tr>
						<th />
						<th colspan={2}>
							<p class="type-title-sm">Rank</p>
						</th>
						<th>
							<p class="type-title-sm">Score</p>
						</th>
						<th>
							<p class="type-title-sm">Title</p>
						</th>
					</tr>
				</thead>
				<tbody>
					<For each={props.output}>
						{(tiedAnimes, i) => (
							<For each={tiedAnimes}>
								{(anime, j) => (
									<tr>
										<td class="move">
											<Show when={j() === 0}>
												<button
													onClick={() => {
														move(i(), true);
													}}
												>
													<svg viewBox="0 0 2 1">
														<polygon fill="inherit" points="0,1 1,0 2,1" />
													</svg>
												</button>
												<hr class="divider" />
												<button
													onClick={() => {
														move(i(), false);
													}}
												>
													<svg viewBox="0 0 2 1">
														<polygon fill="inherit" points="0,0 1,1 2,0" />
													</svg>
												</button>
											</Show>
										</td>
										<td class="merge">
											<Show when={tiedAnimes.length === 1 && i() > 0}>
												<button onClick={() => merge(i())}>
													<img src={iconMerge} alt="Merge" />
												</button>
											</Show>
										</td>
										<td class="rank">
											{/* <div class="rank-content"> */}
											<Show when={j() > 0} fallback={<p class="mono">{i() + 1}</p>}>
												<button onClick={() => split(i(), j())}>
													<img src={iconSplit} alt="Split" />
												</button>
											</Show>
											{/* </div> */}
										</td>
										<td class="score">
											<p class="mono">{calcScore(i())}</p>
										</td>
										<td class="title">
											<p>{anime.media.title.romaji}</p>
										</td>
									</tr>
								)}
							</For>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
};
