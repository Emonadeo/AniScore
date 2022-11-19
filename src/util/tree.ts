export interface Tree {
	/**
	 * Original index of of the list element
	 */
	index: number;
	/**
	 * Subtree above the current element. Undefined if leaf
	 */
	above?: Tree;
	/**
	 * Subtree below the current element. Undefined if leaf
	 */
	below?: Tree;
}

/**
 * Create a binary tree from a given list
 */
export function createTree<T>(list: T[]): Tree | undefined {
	return createTreePartial(list);
}

/**
 * Recursive implementation of {@link createTree} with additional
 * parameters to retain information between recursive steps
 */
function createTreePartial<T>(partialList: T[], indexOffset = 0): Tree | undefined {
	if (partialList.length === 0) return undefined;
	const center = Math.trunc(partialList.length / 2);
	return {
		index: indexOffset + center,
		above: createTreePartial(partialList.slice(0, center), indexOffset),
		below: createTreePartial(partialList.slice(center + 1), indexOffset + center + 1),
	};
}
