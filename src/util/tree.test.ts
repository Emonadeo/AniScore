import { expect, test } from 'vitest';
import { createTree, Tree } from './tree';

test('Empty List creates undefined', () => {
	expect(createTree([])).toBeUndefined();
});

test('List with one item creates leaf', () => {
	expect(createTree(['foo'])).toEqual<Tree>({
		index: 0,
		// above: undefined,
		// below: undefined,
	});
});

test('List with 2 items', () => {
	expect(createTree(['foo', 'bar'])).toEqual<Tree>({
		index: 1,
		above: { index: 0 },
	});
});

test('List with 3 items', () => {
	expect(createTree(Array(3))).toEqual<Tree>({
		index: 1,
		above: { index: 0 },
		below: { index: 2 },
	});
});

test('List with 4 items', () => {
	expect(createTree(Array(4))).toEqual<Tree>({
		index: 2,
		above: {
			index: 1,
			above: {
				index: 0,
			},
		},
		below: { index: 3 },
	});
});

test('List with 5 items', () => {
	expect(createTree(Array(5))).toEqual<Tree>({
		index: 2,
		above: {
			index: 1,
			above: {
				index: 0,
			},
		},
		below: {
			index: 4,
			above: {
				index: 3,
			},
		},
	});
});

test('List with 7 items', () => {
	expect(createTree(Array(7))).toEqual<Tree>({
		index: 3,
		above: {
			index: 1,
			above: { index: 0 },
			below: { index: 2 },
		},
		below: {
			index: 5,
			above: { index: 4 },
			below: { index: 6 },
		},
	});
});

test('List with 15 items', () => {
	expect(createTree(Array(15))).toEqual<Tree>({
		index: 7,
		above: {
			index: 3,
			above: {
				index: 1,
				above: { index: 0 },
				below: { index: 2 },
			},
			below: {
				index: 5,
				above: { index: 4 },
				below: { index: 6 },
			},
		},
		below: {
			index: 11,
			above: {
				index: 9,
				above: { index: 8 },
				below: { index: 10 },
			},
			below: {
				index: 13,
				above: { index: 12 },
				below: { index: 14 },
			},
		},
	});
});

test('List with 31 items', () => {
	expect(createTree(Array(31))).toEqual<Tree>({
		index: 15,
		above: {
			index: 7,
			above: {
				index: 3,
				above: {
					index: 1,
					above: { index: 0 },
					below: { index: 2 },
				},
				below: {
					index: 5,
					above: { index: 4 },
					below: { index: 6 },
				},
			},
			below: {
				index: 11,
				above: {
					index: 9,
					above: { index: 8 },
					below: { index: 10 },
				},
				below: {
					index: 13,
					above: { index: 12 },
					below: { index: 14 },
				},
			},
		},
		below: {
			index: 23,
			above: {
				index: 19,
				above: {
					index: 17,
					above: { index: 16 },
					below: { index: 18 },
				},
				below: {
					index: 21,
					above: { index: 20 },
					below: { index: 22 },
				},
			},
			below: {
				index: 27,
				above: {
					index: 25,
					above: { index: 24 },
					below: { index: 26 },
				},
				below: {
					index: 29,
					above: { index: 28 },
					below: { index: 30 },
				},
			},
		},
	});
});

test('List with 63 items', () => {
	expect(createTree(Array(63))).toEqual<Tree>({
		index: 31,
		above: {
			index: 15,
			above: {
				index: 7,
				above: {
					index: 3,
					above: {
						index: 1,
						above: { index: 0 },
						below: { index: 2 },
					},
					below: {
						index: 5,
						above: { index: 4 },
						below: { index: 6 },
					},
				},
				below: {
					index: 11,
					above: {
						index: 9,
						above: { index: 8 },
						below: { index: 10 },
					},
					below: {
						index: 13,
						above: { index: 12 },
						below: { index: 14 },
					},
				},
			},
			below: {
				index: 23,
				above: {
					index: 19,
					above: {
						index: 17,
						above: { index: 16 },
						below: { index: 18 },
					},
					below: {
						index: 21,
						above: { index: 20 },
						below: { index: 22 },
					},
				},
				below: {
					index: 27,
					above: {
						index: 25,
						above: { index: 24 },
						below: { index: 26 },
					},
					below: {
						index: 29,
						above: { index: 28 },
						below: { index: 30 },
					},
				},
			},
		},
		below: {
			index: 47,
			above: {
				index: 39,
				above: {
					index: 35,
					above: {
						index: 33,
						above: { index: 32 },
						below: { index: 34 },
					},
					below: {
						index: 37,
						above: { index: 36 },
						below: { index: 38 },
					},
				},
				below: {
					index: 43,
					above: {
						index: 41,
						above: { index: 40 },
						below: { index: 42 },
					},
					below: {
						index: 45,
						above: { index: 44 },
						below: { index: 46 },
					},
				},
			},
			below: {
				index: 55,
				above: {
					index: 51,
					above: {
						index: 49,
						above: { index: 48 },
						below: { index: 50 },
					},
					below: {
						index: 53,
						above: { index: 52 },
						below: { index: 54 },
					},
				},
				below: {
					index: 59,
					above: {
						index: 57,
						above: { index: 56 },
						below: { index: 58 },
					},
					below: {
						index: 61,
						above: { index: 60 },
						below: { index: 62 },
					},
				},
			},
		},
	});
});

test('List with 100 items', () => {
	expect(createTree(Array(100))).toEqual<Tree>({
		index: 50,
		above: {
			index: 25,
			above: {
				index: 12,
				above: {
					index: 6,
					above: {
						index: 3,
						above: {
							index: 1,
							above: {
								index: 0,
							},
							below: {
								index: 2,
							},
						},
						below: {
							index: 5,
							above: {
								index: 4,
							},
						},
					},
					below: {
						index: 9,
						above: {
							index: 8,
							above: {
								index: 7,
							},
						},
						below: {
							index: 11,
							above: {
								index: 10,
							},
						},
					},
				},
				below: {
					index: 19,
					above: {
						index: 16,
						above: {
							index: 14,
							above: {
								index: 13,
							},
							below: {
								index: 15,
							},
						},
						below: {
							index: 18,
							above: {
								index: 17,
							},
						},
					},
					below: {
						index: 22,
						above: {
							index: 21,
							above: {
								index: 20,
							},
						},
						below: {
							index: 24,
							above: {
								index: 23,
							},
						},
					},
				},
			},
			below: {
				index: 38,
				above: {
					index: 32,
					above: {
						index: 29,
						above: {
							index: 27,
							above: {
								index: 26,
							},
							below: {
								index: 28,
							},
						},
						below: {
							index: 31,
							above: {
								index: 30,
							},
						},
					},
					below: {
						index: 35,
						above: {
							index: 34,
							above: {
								index: 33,
							},
						},
						below: {
							index: 37,
							above: {
								index: 36,
							},
						},
					},
				},
				below: {
					index: 44,
					above: {
						index: 41,
						above: {
							index: 40,
							above: {
								index: 39,
							},
						},
						below: {
							index: 43,
							above: {
								index: 42,
							},
						},
					},
					below: {
						index: 47,
						above: {
							index: 46,
							above: {
								index: 45,
							},
						},
						below: {
							index: 49,
							above: {
								index: 48,
							},
						},
					},
				},
			},
		},
		below: {
			index: 75,
			above: {
				index: 63,
				above: {
					index: 57,
					above: {
						index: 54,
						above: {
							index: 52,
							above: {
								index: 51,
							},
							below: {
								index: 53,
							},
						},
						below: {
							index: 56,
							above: {
								index: 55,
							},
						},
					},
					below: {
						index: 60,
						above: {
							index: 59,
							above: {
								index: 58,
							},
						},
						below: {
							index: 62,
							above: {
								index: 61,
							},
						},
					},
				},
				below: {
					index: 69,
					above: {
						index: 66,
						above: {
							index: 65,
							above: {
								index: 64,
							},
						},
						below: {
							index: 68,
							above: {
								index: 67,
							},
						},
					},
					below: {
						index: 72,
						above: {
							index: 71,
							above: {
								index: 70,
							},
						},
						below: {
							index: 74,
							above: {
								index: 73,
							},
						},
					},
				},
			},
			below: {
				index: 88,
				above: {
					index: 82,
					above: {
						index: 79,
						above: {
							index: 77,
							above: {
								index: 76,
							},
							below: {
								index: 78,
							},
						},
						below: {
							index: 81,
							above: {
								index: 80,
							},
						},
					},
					below: {
						index: 85,
						above: {
							index: 84,
							above: {
								index: 83,
							},
						},
						below: {
							index: 87,
							above: {
								index: 86,
							},
						},
					},
				},
				below: {
					index: 94,
					above: {
						index: 91,
						above: {
							index: 90,
							above: {
								index: 89,
							},
						},
						below: {
							index: 93,
							above: {
								index: 92,
							},
						},
					},
					below: {
						index: 97,
						above: {
							index: 96,
							above: {
								index: 95,
							},
						},
						below: {
							index: 99,
							above: {
								index: 98,
							},
						},
					},
				},
			},
		},
	});
});
