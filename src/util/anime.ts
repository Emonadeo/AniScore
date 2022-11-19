import { MediaFormat, MediaListStatus, MediaSeason } from 'src/generated/graphql';

export interface Anime {
	status: MediaListStatus;
	progress: number;
	media: {
		title: {
			romaji: string;
			english?: string;
			native: string;
		};
		format: MediaFormat;
		episodes: number;
		season: MediaSeason;
		seasonYear: number;
		coverImage: {
			large: string;
		};
		siteUrl: string;
	};
}
