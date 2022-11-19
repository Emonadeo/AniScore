import { Component, createSignal, For, onCleanup, onMount } from 'solid-js';
import { Anime } from 'src/util/anime';

import './export.scss';

interface Props {
	list: Anime[];
}

const minScore = 0;
const maxScore = 100;

function calcScore(i: number, length: number): number {
	return Math.trunc((1 - i / length) * (maxScore - minScore) + minScore);
}

export const Export: Component<Props> = function (props) {
	return (
		<div class="view-export">
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
									<p class="mono">{calcScore(i(), props.list.length)}</p>
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
