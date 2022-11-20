import { Accessor, Component, createSignal, For, onCleanup, onMount, Setter } from 'solid-js';

interface Props {
	keybinds: { [key: string]: (e: KeyboardEvent) => void };
}

export const Keybinds: Component<Props> = function (props) {
	const [keys, setKeys] = createSignal<{
		[key: string]: { pressed: Accessor<boolean>; setPressed: Setter<boolean> };
	}>({});

	function onKeyDown(e: KeyboardEvent) {
		const handler = props.keybinds[e.key];
		if (!handler) {
			return;
		}
		keys()[e.key].setPressed(true);
		e.preventDefault();
		handler(e);
	}

	function onKeyUp(e: KeyboardEvent) {
		if (!(e.key in props.keybinds)) {
			return;
		}
		keys()[e.key].setPressed(false);
		e.preventDefault();
	}

	onMount(() => {
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
		// Initialize keys array
		setKeys(
			Object.fromEntries(
				Object.entries(props.keybinds).map(([key]) => {
					const [pressed, setPressed] = createSignal(false);
					return [key, { pressed, setPressed }];
				})
			)
		);
	});

	onCleanup(() => {
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	});

	return (
		<>
			<For each={Object.keys(props.keybinds)}>
				{(key) => <kbd classList={{ pressed: keys()[key]?.pressed() }}>{key}</kbd>}
			</For>
		</>
	);
};
