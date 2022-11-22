import './play.scss';

import { Component, createEffect, onMount } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { Anime as AnimeComponent } from 'src/components/Anime';
import { Keybinds } from 'src/components/Keybinds';
import { Game } from 'src/game';
import { Anime } from 'src/util/anime';
import { createTree, Tree } from 'src/util/tree';

interface Props {
	game: Game;
	onDone: (list: Anime[][]) => void;
	onClear: () => void;
}

export const Play: Component<Props> = function (props) {
	const challenger = function (): Anime {
		// FIXME: Too smart code
		return (props.game.list().at(props.game.tree().index || 0) || [props.game.source()[0]])[0];
	};

	const challengee = function (): Anime {
		props.game.tree(); // Refresh when tree changes to trigger animation
		return { ...(props.game.source()[props.game.list().flat().length] || props.game.source()[0]) };
	};

	// Done Condition
	createEffect(() => {
		if (props.game.list().flat().length === props.game.source().length) {
			console.log(`🎉 Done in ${props.game.progress()} steps!`);
			props.onDone(props.game.list());
			props.game.setTree({ index: 0 }); // TODO: Remove
			return;
		}
	});

	// TODO: Remove DEBUG
	onMount(() => {
		const test = setInterval(() => {
			// Generate random number between 0 and 2
			const r = Math.trunc(Math.random() * 3);
			// Randomly commit true, false or undefined
			// commit(r === 0 ? undefined : r === 1);
			commit(true);
			if (props.game.list().flat().length === props.game.source().length) {
				clearInterval(test);
			}
		}, 1);
	});

	function onClear() {
		if (!confirm('Are you sure you want to abort? This will delete all progress.')) {
			return;
		}
		props.onClear();
	}

	function commit(above?: boolean) {
		props.game.setProgress((p) => p + 1);
		props.game.setLocalProgress((p) => p + 1);

		// Tie
		if (above === undefined) {
			// TODO: D.R.Y
			// Boost progress bar if less steps were required than the theoretical maximum
			props.game.setProgress(
				(p) => p + (props.game.maxLocalProgress() - props.game.localProgress())
			);

			const l = props.game.list().slice();
			l[props.game.tree().index].push(challengee());
			props.game.setList(l);

			// TODO: D.R.Y
			// Reset tree after inserting anime
			props.game.setTree(createTree(props.game.list()) as Tree); // TODO: null safety
			props.game.setLocalProgress(0);
			return;
		}

		const t = props.game.tree();
		const next = above ? t.above : t.below;

		// Enter next layer of binary tree
		if (next) {
			props.game.setTree(next);
			return;
		}

		// TODO: D.R.Y
		// Boost progress bar if less steps were required than the theoretical maximum
		props.game.setProgress((p) => p + (props.game.maxLocalProgress() - props.game.localProgress()));

		// Insert into list after reaching final layer
		const l = props.game.list().slice();
		let pos = t.index;
		if (!above) pos += 1;
		l.splice(pos, 0, [challengee()]);
		props.game.setList(l);

		// TODO: D.R.Y
		// Reset tree after inserting anime
		props.game.setTree(createTree(props.game.list()) as Tree); // TODO: null safety
		props.game.setLocalProgress(0);
	}

	const onLeft = () => commit(false);
	const onRight = () => commit(true);
	const onTie = () => commit();

	return (
		<div class="view-play">
			<div class="actions">
				<button class="type-label-lg danger" onClick={onClear}>
					Abort
				</button>
			</div>
			<div class="progress">
				<label for="bar" class="type-label-lg">
					{props.game.progress()} / {props.game.maxProgress()}
				</label>
				<progress id="bar" max={props.game.maxProgress()} value={props.game.progress()} />
			</div>
			<div class="duel">
				<Transition name="swap">
					<AnimeComponent class="left" anime={challenger()} onClick={onLeft} />
				</Transition>
				<button class="tie primary type-label-lg" onClick={onTie}>
					Tie
				</button>
				<Transition name="swap">
					<AnimeComponent class="right" anime={challengee()} onClick={onRight} />
				</Transition>
				<Keybinds keybinds={{ j: onLeft, ' ': onTie, k: onRight }} />
			</div>
		</div>
	);
};
