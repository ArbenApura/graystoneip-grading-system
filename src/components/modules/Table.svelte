<svelte:options accessors={true} />

<script lang="ts">
	// IMPORTED LIB-COMPONENTS
	import { ButtonGroup, Button, Select, Table, TableBody, TableHead } from 'flowbite-svelte';

	// PROPS
	export let items: any[];

	// EXPORTED STATES
	export let filteredItems: any[] = [],
		startingItem = 0;

	// STATES
	let limit = 10,
		page = 0;

	// REACTIVE STATES
	$: start = page * limit;
	$: end = (page + 1) * limit;
	$: filtered = items.slice(start, end);

	// REACTIVE STATEMENTS
	$: limit && (page = 0);
	$: {
		filteredItems = filtered;
		startingItem = start;
	}

	// UTILS
	const handleNext = () => page++;
	const handlePrev = () => page--;
</script>

<div class="bg-white p-4 pb-0 rounded-md shadow-md">
	<Table>
		<TableHead class="whitespace-nowrap">
			<slot name="table-head" />
		</TableHead>
		<TableBody>
			<slot name="table-body" />
		</TableBody>
	</Table>
	<hr />
	<div class="text-xs flex items-stretch flex-col sm:flex-row gap-4 py-4">
		<div class="flex items-center gap-4">
			<p class="whitespace-nowrap">Items per page:</p>
			<Select
				bind:value={limit}
				class="min-w-[80px]"
				items={[
					{ name: '10', value: 10 },
					{ name: '20', value: 20 },
					{ name: '50', value: 50 },
					{ name: '100', value: 100 },
				]}
				placeholder=""
				size="sm"
			/>
		</div>
		<div class="border-r hidden sm:block" />
		<div class="w-full flex items-center gap-4">
			<p class="flex-grow flex items-center">
				{items.length ? start + 1 : 0}-{items.length < end ? items.length : end} of {items.length}
				items
			</p>
			<ButtonGroup>
				<Button on:click={handlePrev} disabled={page === 0}>
					<i class="ti ti-chevron-left" />
				</Button>
				<Button on:click={handleNext} disabled={items.length < end}>
					<i class="ti ti-chevron-right" />
				</Button>
			</ButtonGroup>
		</div>
	</div>
</div>
