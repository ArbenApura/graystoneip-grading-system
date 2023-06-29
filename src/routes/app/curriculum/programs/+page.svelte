<script lang="ts">
	// IMPORTED TYPES
	import type { Program } from '$types/index';
	// IMPORTED STATES
	import { isSMDown } from '$stores/mediaStates';
	// IMPORTED LIB-COMPONENTS
	import {
		FloatingLabelInput,
		Button,
		TableHeadCell,
		TableBodyRow,
		TableBodyCell,
	} from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import ProgramAdderModal from './components/ProgramAdderModal.svelte';
	import ProgramEditorModal from './components/ProgramEditorModal.svelte';
	import Table from '$components/modules/Table.svelte';

	// STATES
	let programs: Program[] = [
		{
			id: '1',
			code: 'BSIT',
			description: 'Bachelor of Science in Information Technology',
			createdAt: Date.now(),
		},
		{
			id: '2',
			code: 'BSA',
			description: 'Bachelor of Science in Accountancy',
			createdAt: Date.now(),
		},
		{
			id: '3',
			code: 'BSED',
			description: 'Bachelor in Secondary Education',
			createdAt: Date.now(),
		},
		{
			id: '4',
			code: 'BEED',
			description: 'Bachelor in Elementary Education',
			createdAt: Date.now(),
		},
		{
			id: '5',
			code: 'BSN',
			description: 'Bachelor of Science in Nursing',
			createdAt: Date.now(),
		},
		{
			id: '6',
			code: 'BSCE',
			description: 'Bachelor of Science in Civil Engineering',
			createdAt: Date.now(),
		},
	];
	let filteredItems: Program[];
	let startingItem = 0;
	let modals = { adder: false, editor: false };
	let target: Program | null = null;

	// UTILS
	const openAdderModal = () => (modals.adder = true);
	const closeAdderModal = () => (modals.adder = false);
	const openEditorModal = (program: Program) => {
		modals.editor = true;
		target = program;
	};
	const closeEditorModal = () => (modals.editor = false);
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ti ti-list-details', label: 'Curriculum', href: '' },
		{ label: 'Programs', href: '/app/curriculum/programs' },
	]}
/>

{#if modals.adder}
	<ProgramAdderModal handleClose={closeAdderModal} />
{/if}
{#if target}
	{#if modals.editor}
		<ProgramEditorModal program={target} handleClose={closeEditorModal} />
	{/if}
{/if}

<div class="p-4 pt-0 flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<div class="search w-full md:w-[50%] bg-white rounded-md shadow-md p-2 flex gap-2">
			<FloatingLabelInput style="outlined" type="text" label="Search..." />
			<Button class="w-[48px] h-[48px]"><i class="ti ti-search text-xl" /></Button>
		</div>
		<Button
			class={`w-[48px] h-[48px] shadow-md ${
				$isSMDown && 'fixed bottom-[16px] right-[16px] z-20'
			}`}
			pill={true}
			on:click={openAdderModal}
		>
			<i class="ti ti-plus text-xl" />
		</Button>
	</div>
	<Table items={programs} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Code</TableHeadCell>
			<TableHeadCell>Description</TableHeadCell>
			<TableHeadCell>Created At</TableHeadCell>
			<TableHeadCell class="rounded-r-md">Tools</TableHeadCell>
		</svelte:fragment>
		<svelte:fragment slot="table-body">
			{#if filteredItems && filteredItems.length}
				{#each filteredItems as item, i}
					<TableBodyRow>
						<TableBodyCell>{startingItem + 1 + i}</TableBodyCell>
						<TableBodyCell>{item.code}</TableBodyCell>
						<TableBodyCell>{item.description}</TableBodyCell>
						<TableBodyCell>{new Date(item.createdAt).toDateString()}</TableBodyCell>
						<TableBodyCell class="flex gap-2">
							<Button
								class="w-[25px] h-[25px] flex-center"
								color="green"
								on:click={() => openEditorModal(item)}
							>
								<i class="ti ti-pencil text-sm" />
							</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			{/if}
		</svelte:fragment>
	</Table>
</div>

<style lang="scss">
	:global(.search > div) {
		flex-grow: 1;
	}
</style>
