import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: 'https://graphql.anilist.co/',
	documents: ['src/**/*.tsx'],
	generates: {
		'src/generated/graphql.ts': {
			plugins: ['typescript', 'typescript-operations'],
			// plugins: ['typescript'],
		},
	},
};

export default config;
