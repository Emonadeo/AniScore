import { Component, createSignal, onCleanup, onMount } from 'solid-js';

const symbols = ['◰', '◳', '◲', '◱'];

export const Spinner: Component = function () {
	const [spinner, setSpinner] = createSignal<number>(0);

	let interval: NodeJS.Timer;
	onMount(() => {
		interval = setInterval(() => setSpinner((p) => (p < 3 ? p + 1 : 0)), 100);
	});

	onCleanup(() => {
		clearInterval(interval);
	});

	return <p>{symbols[spinner()]}</p>;
};
