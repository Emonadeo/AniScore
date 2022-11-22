import { Component, createResource, ResourceFetcher, Show } from 'solid-js';
import { MediaFormat } from 'src/generated/graphql';
import { Anime as IAnime } from 'src/util/anime';

import './anime.scss';

interface Props {
	class: string;
	anime: IAnime;
	onClick?: () => void;
}

const animationDuration = 500;

// TODO: Animation glitches when changing too quickly
const animate: ResourceFetcher<IAnime, IAnime> = async function (anime, { value }) {
	if (!value) return anime;
	await new Promise((resolve) => setTimeout(resolve, animationDuration));
	return anime;
};

export const Anime: Component<Props> = function (props) {
	const [anime] = createResource(() => props.anime, animate);

	return (
		<Show when={anime.state == 'ready'}>
			<button class={`anime ${props.class}`} onClick={() => props.onClick && props.onClick()}>
				<figure>
					<img class="cover" src={anime()?.media.coverImage.large} alt="" />
					<figcaption class="type-title-lg caption">
						{anime()?.media.title.english || anime()?.media.title.romaji}
					</figcaption>
					<ul role="list" class="stats">
						<li class="format">
							<p class="type-label-lg">{anime()?.media.format}</p>
							<Show when={anime()?.media.format === MediaFormat.Tv}>
								<p class="type-label-lg eps">&ctdot;</p>
								<p class="type-label-lg eps">{anime()?.media.episodes} EPs</p>
							</Show>
						</li>
						<li class="year">
							<p class="type-label-lg">
								<span>{anime()?.media.seasonYear}</span>
							</p>
						</li>
					</ul>
				</figure>
			</button>
		</Show>
	);
};
