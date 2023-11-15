<script lang="ts">
	// IMPORTED TYPES
	import type { CriteriaItemData } from '$types';
	// IMPORTED STORES
	import {
		addCriteriaItem,
		addCriteria,
		removeCriteriaItem,
		removeCriteria,
	} from './ScoreItem.svelte';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// UTILS
	import { generateId } from '$utils';

	// PROPS
	export let criteria_item: CriteriaItemData,
		criteria_id: string,
		course_class_id: string,
		course_student_id: string;

	// STATES
	let score: number | null = null;
	let id = generateId();

	// REACTIVE STATES
	$: modified = score !== null;

	// REACTIVE STATEMENTS
	$: if (typeof score === 'number') {
		if (score < 0) {
			score = 0;
		} else if (score > criteria_item.total) {
			score = criteria_item.total;
		}
	}
	$: if (modified) {
		addCriteriaItem({
			criteria_item_id: criteria_item.id,
			criteria_grade_id: id,
			score: score || 0,
			course_class_id,
			course_student_id,
		});
		addCriteria(criteria_id);
	} else {
		removeCriteriaItem(criteria_item.id);
	}

	// LIFECYCLES
	onMount(() => () => {
		removeCriteria(criteria_id);
		removeCriteriaItem(criteria_item.id);
	});
</script>

<td class="relative" data-input data-modified={modified}>
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
