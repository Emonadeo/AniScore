import './start.scss';

import { Component } from 'solid-js';

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
