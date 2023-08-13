<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED TYPES
	import type { Account } from '$types/index';
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
	import { unarchiveAccount, selectAccounts } from '$utils/supabase';
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
	let professors: Account[] = [];
	let filteredItems: Account[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			professors = await selectAccounts({ type: 'professor', search, is_archived: true });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleRecover = async (id: string) => {
		isLoading = true;
		const modalId = createLoadingModal({ message: 'Unarchiving professor account...' });
		try {
			await unarchiveAccount(id);
			await handleSearch();
			createSuccessModal({ message: 'Professor account was unarchived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		isLoading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.professors) professors = data.professors;
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ti ti-archive', label: 'Archive', href: '' },
		{ label: 'Professors', href: '/app/archive/professors' },
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
				label="Search Names..."
				bind:value={search}
			/>
			<Button class="w-[48px] h-[48px]" type="submit" disabled={isLoading}>
				<i class="ti ti-search text-xl" />
			</Button>
		</form>
	</div>
	<Table items={professors} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Avatar</TableHeadCell>
			<TableHeadCell>Last Name</TableHeadCell>
			<TableHeadCell>First Name</TableHeadCell>
			<TableHeadCell>Middle Name</TableHeadCell>
			<TableHeadCell>Gender</TableHeadCell>
			<TableHeadCell>Contact No.</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell class="rounded-r-md">Tools</TableHeadCell>
		</svelte:fragment>
		<svelte:fragment slot="table-body">
			{#if filteredItems && filteredItems.length}
				{#each filteredItems as item, i}
					<TableBodyRow>
						<TableBodyCell>{startingItem + 1 + i}</TableBodyCell>
						<TableBodyCell>
							<div class="rounded-full border-[2px] p-[2px] w-fit border-blue-600">
								<div
									class="bg-gray-100 w-[35px] h-[35px] rounded-full bg-cover bg-center"
									style="background-image: url({item.avatar || NoImagePNG})"
								/>
							</div>
						</TableBodyCell>
						<TableBodyCell>{item.last_name}</TableBodyCell>
						<TableBodyCell>{item.first_name}</TableBodyCell>
						<TableBodyCell>{item.middle_name}</TableBodyCell>
						<TableBodyCell class="capitalize">{item.gender}</TableBodyCell>
						<TableBodyCell>{item.contact_number}</TableBodyCell>
						<TableBodyCell>{item.email}</TableBodyCell>
						<TableBodyCell class="flex gap-2">
							<Button
								class="w-[25px] h-[25px] flex-center"
								on:click={() =>
									createConfirmationModal({
										message:
											'Are you sure you want to unarchive this professor account?',
										handleProceed: () =>
											createVerificationModal({
												handleProceed: () => handleRecover(item.id),
											}),
									})}
							>
								<i class="ti ti-archive-off text-sm" />
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
