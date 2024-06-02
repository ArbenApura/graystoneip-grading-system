<script lang="ts">
	// IMPORTED TYPES
	import type { FilterGroup, RowItem, SortItem } from './types';
	// IMPORTED COMPONENTS
	import Thumbnail from './Thumbnail.svelte';

	// PROPS
	export let search: string,
		rowItems: RowItem[],
		sortItems: SortItem[],
		filterGroups: FilterGroup[];

	// -- STATES -- //

	let loading = false;

	// REACTIVE STATES
	$: filtered = (() => {
		if (!filterGroups.length) return rowItems;
		let result: RowItem[] = [...rowItems];
		filterGroups.map(({ name, items }) => {
			result = result.filter(
				({ columnItems }) =>
					!columnItems.some(
						(columnItem) =>
							columnItem.name === name &&
							!items
								.map((item) => (item.active ? item.match : null))
								.includes(columnItem.value),
					),
			);
		});
		return result;
	})();

	$: searched = (() => {
		if (!search) return filtered;
		const result: RowItem[] = [];
		for (let i = 0; i < filtered.length; i++) {
			const rowItem = filtered[i];
			const searchKey = rowItem.columnItems.map(({ value }) => value).toString();
			if (searchKey.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1)
				result.push(rowItem);
		}
		return result;
	})();

	$: sorted = (() => {
		let result: RowItem[] = [...searched];
		if (!searched.length) return result;
		sortItems.map(({ name, type }) => {
			if (type === 'none') return;
			let index = 0;
			let is_date = false;
			searched[0].columnItems.map((columnItem, i) => name === columnItem.name && (index = i));
			if (searched[0].columnItems[index].name === 'created_at') is_date = true;
			if (is_date) {
				result = result.sort((a, b) =>
					type === 'desc'
						? new Date(a.columnItems[index].value)
								.getTime()
								.toString()
								.localeCompare(
									new Date(b.columnItems[index].value).getTime().toString(),
								)
						: new Date(b.columnItems[index].value)
								.getTime()
								.toString()
								.localeCompare(
									new Date(a.columnItems[index].value).getTime().toString(),
								),
				);
			} else {
				result = result.sort((a, b) =>
					type === 'asc'
						? a.columnItems[index].value.localeCompare(b.columnItems[index].value)
						: b.columnItems[index].value.localeCompare(a.columnItems[index].value),
				);
			}
		});
		return result;
	})();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
	{#each sorted as rowItem}
		<Thumbnail bind:loading {rowItem} />
	{/each}
</div>
