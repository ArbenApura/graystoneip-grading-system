<script lang="ts">
	// IMPORTED TYPES
	import type { Column, FilterGroup, RowItem, SortItem } from './types';
	// IMPORTED LIB-UTILS
	import _ from 'lodash';
	// IMPORTED LIB-COMPONENTS
	import { Table, Select, Button } from '$lib';
	// IMPORTED COMPONENTS
	import TableToolHead from './TableToolHead.svelte';
	import TableToolBody from './TableToolBody.svelte';

	// PROPS
	export let search: string,
		toolPosition: 'front' | 'end' = 'end',
		columns: Column[],
		rowItems: RowItem[],
		sortItems: SortItem[],
		filterGroups: FilterGroup[];

	// STATES
	let selectedLimit = { value: 10 };
	let page = 0;
	let loading = false;

	// REACTIVE STATES
	$: limit = selectedLimit.value;
	$: start = page * limit;
	$: end = (page + 1) * limit;
	$: visibleColumns = columns.filter(({ visible }) => visible).map(({ name }) => name);
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
		page = 0;
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
			if (searched[0].columnItems[index].label === 'created_at') is_date = true;
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
	$: sliced = sorted.slice(start, end);

	// REACTIVE STATEMENTS
	$: limit && (page = 0);

	// UTILS
	const handleNext = () => page++;
	const handlePrev = () => page--;
</script>

<div class="interactive-table bg-white border rounded-md shadow-md">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="font-semibold">#</Table.Head>
				{#if toolPosition === 'front'}
					<TableToolHead {sliced} />
				{/if}
				{#each columns as column}
					{#if column.visible}
						<Table.Head class="font-semibold">{column.label}</Table.Head>
					{/if}
				{/each}
				{#if toolPosition === 'end'}
					<TableToolHead {sliced} />
				{/if}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each sliced as rowItem, i}
				<Table.Row>
					<Table.Cell>{start + i + 1}</Table.Cell>
					{#if toolPosition === 'front'}
						<TableToolBody {...{ rowItem, loading }} />
					{/if}
					{#each rowItem.columnItems as columnItem}
						{#if visibleColumns.includes(columnItem.name)}
							<Table.Cell>{columnItem.value}</Table.Cell>
						{/if}
					{/each}
					{#if toolPosition === 'end'}
						<TableToolBody {...{ rowItem, loading }} />
					{/if}
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
	<hr />
	<div class="text-xs flex items-stretch flex-col sm:flex-row gap-4 p-4">
		<div class="flex items-center gap-4">
			<p class="whitespace-nowrap">Items per page:</p>
			<Select.Root bind:selected={selectedLimit}>
				<Select.Trigger class="w-full md:w-[80px] flex justify-between items-center gap-2">
					<Select.Value placeholder={limit.toString()} />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value={10}>10</Select.Item>
					<Select.Item value={25}>25</Select.Item>
					<Select.Item value={50}>50</Select.Item>
					<Select.Item value={100}>100</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="border-r hidden sm:block" />
		<div class="w-full flex items-center gap-4">
			<p class="flex-grow flex items-center">
				{sliced.length ? start + 1 : 0}-{sliced.length < end ? start + sliced.length : end} of
				{sorted.length}
				items
			</p>
			<div class="flex gap-4">
				<Button variant="outline" size="icon" disabled={page === 0} on:click={handlePrev}>
					<i class="ph-bold ph-caret-left" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					disabled={sorted.length < end}
					on:click={handleNext}
				>
					<i class="ph-bold ph-caret-right" />
				</Button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.interactive-table {
		:global(*) {
			@apply text-xs whitespace-nowrap;
		}
		:global(td) {
			@apply select-text;
		}
		:global(tbody tr:nth-child(odd)) {
			@apply bg-gray-100;
		}
	}
</style>
