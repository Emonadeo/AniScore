import { Component, Show } from 'solid-js';
import { MediaFormat } from 'src/generated/graphql';
import { Anime as IAnime } from 'src/util/anime';

import './anime.scss';

interface Props {
	anime: IAnime;
	onClick?: () => void;
}

export const Anime: Component<Props> = function (props) {
	return (
		<button class="anime" onClick={() => props.onClick && props.onClick()}>
			<figure>
				<img class="cover" src={props.anime.media.coverImage.large} alt="" />
				<figcaption class="type-title-lg caption">
					{props.anime.media.title.english || props.anime.media.title.romaji}
				</figcaption>
				<ul role="list" class="stats">
					<li class="format">
						<p class="type-label-lg">{props.anime.media.format}</p>
						<Show when={props.anime.media.format === MediaFormat.Tv}>
							<p class="type-label-lg eps">&ctdot;</p>
							<p class="type-label-lg eps">{props.anime.media.episodes} EPs</p>
						</Show>
					</li>
					<li class="year">
						<p class="type-label-lg">
							<span>{props.anime.media.seasonYear}</span>
						</p>
					</li>
				</ul>
			</figure>
		</button>
	);
};
