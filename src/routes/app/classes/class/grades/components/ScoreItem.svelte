<script lang="ts" context="module">
	// IMPORTED LIB-UTILS
	import { writable } from 'svelte/store';

	// IMPORTED TYPES
	export type ModifiedItem = {
		criteria_item_id: string;
		criteria_grade_id: string;
		score: number;
	};

	// STATES
	export const modifiedCriterias = writable<string[]>([]);
	export const modifiedCriteriaItems = writable<ModifiedItem[]>([]);

	// UTILS
	const addCriteria = (id: string) => modifiedCriterias.update((values) => [...values, id]);
	const removeCriteria = (id: string) =>
		modifiedCriterias.update((values) => values.filter((value) => value !== id));
	const addCriteriaItem = (item: ModifiedItem) =>
		modifiedCriteriaItems.update((values) => [...values, item]);
	const removeCriteriaItem = (id: string) =>
		modifiedCriteriaItems.update((values) =>
			values.filter((value) => value.criteria_item_id !== id),
		);
	export const handleReset = () => {
		modifiedCriterias.set([]);
		modifiedCriteriaItems.set([]);
	};
</script>

<script lang="ts">
	// IMPORTED TYPES
	import type { CriteriaGradeData } from '$types';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';

	// PROPS
	export let criteria_grade: CriteriaGradeData, criteria_id: string;

	// STATES
	let score = criteria_grade.score;

	// REACTIVE STATES
	$: modified = score !== criteria_grade.score;

	// REACTIVE STATEMENTS
	$: if (score < 0) {
		score = 0;
	} else if (score > criteria_grade.criteria_item.total) {
		score = criteria_grade.criteria_item.total;
	}
	$: if (modified) {
		addCriteriaItem({
			criteria_item_id: criteria_grade.criteria_item_id,
			criteria_grade_id: criteria_grade.id,
			score: score || 0,
		});
		addCriteria(criteria_id);
	} else {
		removeCriteriaItem(criteria_grade.criteria_item_id);
	}

	// LIFECYCLES
	onMount(() => () => {
		removeCriteria(criteria_id);
		removeCriteriaItem(criteria_grade.criteria_item_id);
	});
</script>

<td data-input data-modified={modified}>
	<input type="number" bind:value={score} />
	<span class="absolute opacity-0 -z-1">{score}</span>
</td>

<style lang="scss">
	[data-input] {
		@apply p-0;
		input {
			@apply w-full h-full text-xs bg-transparent border-none;
			text-align: inherit;
			&::-webkit-outer-spin-button,
			&::-webkit-inner-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}
			&[type='number'] {
				-moz-appearance: textfield;
			}
		}
		&[data-modified='true'] {
			@apply bg-gray-400 text-white;
		}
	}
	table,
	th,
	td {
		@apply text-xs border min-w-[60px] whitespace-nowrap;
		&[data-input] {
			@apply cursor-pointer hover:outline outline-1 outline-blue-500;
			&[data-modified='true'] {
				@apply outline-gray-500;
			}
		}
		& > p {
			@apply p-2;
		}
	}
	th {
		@apply font-semibold;
	}
	table {
		@apply border-r-0;
	}
	thead {
		th:last-child {
			@apply border-r-0;
		}
	}
	tbody {
		td:last-child {
			@apply border-r-0;
		}
		tr:last-child {
			td[data-input] {
				@apply hover:border-b-blue-500;
				&[data-modified='true'] {
					@apply hover:border-b-gray-500;
				}
			}
		}
		tr:nth-child(even) {
			@apply bg-gray-50;
		}
	}
</style>
