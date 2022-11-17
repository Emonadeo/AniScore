import type { Component } from 'solid-js';

import { Start } from './views/Start';

import styles from './App.module.scss';

export const App: Component = function () {
	return (
		<>
			<Start />
		</>
	);
};
