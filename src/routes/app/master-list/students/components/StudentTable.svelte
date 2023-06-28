<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED LIB-COMPONENTS
	import {
		ButtonGroup,
		Button,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from 'flowbite-svelte';

	// PROPS
	export let students: Account[], openEditorModal: (account: Account) => void;

	// STATES
	let limit = 10,
		page = 0;

	// REACTIVE STATES
	$: start = page * limit;
	$: end = (page + 1) * limit;
	$: filtered = students.slice(start, end);

	// REACTIVE STATEMENTS
	$: limit && (page = 0);

	// UTILS
	const handleNext = () => page++;
	const handlePrev = () => page--;
</script>

<div class="bg-white p-4 pb-0 rounded-md shadow-md">
	<Table>
		<TableHead class="whitespace-nowrap">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Last Name</TableHeadCell>
			<TableHeadCell>First Name</TableHeadCell>
			<TableHeadCell>Middle Name</TableHeadCell>
			<TableHeadCell>Gender</TableHeadCell>
			<TableHeadCell>Contact No.</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell class="rounded-r-md">Tools</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each filtered as professor, i}
				<TableBodyRow>
					<TableBodyCell>{start + 1 + i}</TableBodyCell>
					<TableBodyCell>{professor.lastName}</TableBodyCell>
					<TableBodyCell>{professor.firstName}</TableBodyCell>
					<TableBodyCell>{professor.middleName}</TableBodyCell>
					<TableBodyCell class="capitalize">{professor.gender}</TableBodyCell>
					<TableBodyCell>{professor.contactNo}</TableBodyCell>
					<TableBodyCell>{professor.email}</TableBodyCell>
					<TableBodyCell class="flex gap-2">
						<Button
							class="w-[25px] h-[25px] flex-center"
							color="green"
							on:click={() => openEditorModal(professor)}
						>
							<i class="ti ti-pencil text-sm" />
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
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
				{start + 1}-{students.length < end ? students.length : end} of {students.length}
				items
			</p>
			<ButtonGroup>
				<Button on:click={handlePrev} disabled={page === 0}>
					<i class="ti ti-chevron-left" />
				</Button>
				<Button on:click={handleNext} disabled={students.length < end}>
					<i class="ti ti-chevron-right" />
				</Button>
			</ButtonGroup>
		</div>
	</div>
</div>
