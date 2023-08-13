<script lang="ts">
	// IMPORTED TYPES
	import type { Program } from '$types/index';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// IMPORTED UTILS
	import {
		createConfirmationModal,
		createErrorModal,
		createLoadingModal,
		createSuccessModal,
		createVerificationModal,
		removeModal,
	} from '$stores/modalStates';
	import { unarchiveProgram, selectPrograms } from '$utils/supabase';
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
	import Table from '$components/modules/Table.svelte';

	// PROPS
	export let data: any;

	// STATES
	let programs: Program[] = [];
	let filteredItems: Program[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			programs = await selectPrograms({ search, is_archived: true });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleArchive = async (id: string) => {
		isLoading = true;
		const modalId = createLoadingModal({ message: 'Unarchiving program...' });
		try {
			await unarchiveProgram(id);
			await handleSearch();
			createSuccessModal({ message: 'Program was unarchived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		isLoading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.programs) programs = data.programs;
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ti ti-archive', label: 'Archive', href: '' },
		{ label: 'Programs', href: '/app/archive/programs' },
	]}
/>

<div class="p-4 pt-0 flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<form
			class="search w-full md:w-[50%] bg-white rounded-md shadow-md p-2 flex gap-2"
			on:submit|preventDefault={handleSearch}
		>
			<FloatingLabelInput
				style="outlined"
				type="text"
				label="Search Codes..."
				bind:value={search}
			/>
			<Button class="w-[48px] h-[48px]" type="submit" disabled={isLoading}>
				<i class="ti ti-search text-xl" />
			</Button>
		</form>
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
						<TableBodyCell>{new Date(item.created_at).toDateString()}</TableBodyCell>
						<TableBodyCell class="flex gap-2">
							<Button
								class="w-[25px] h-[25px] flex-center"
								on:click={() =>
									createConfirmationModal({
										message: 'Are you sure you want to unarchive this program?',
										handleProceed: () =>
											createVerificationModal({
												handleProceed: () => handleArchive(item.id),
											}),
									})}
							>
								<i class="ti ti-archive text-sm" />
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
