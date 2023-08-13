<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// IMPORTED UTILS
	import { generateId } from '$utils/helpers';
	import {
		createConfirmationModal,
		createCustomModal,
		createErrorModal,
		createLoadingModal,
		createSuccessModal,
		createVerificationModal,
		removeCustomModal,
		removeModal,
	} from '$stores/modalStates';
	import { archiveAccount, selectAccounts } from '$utils/supabase';
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
	import ProfessorAdderModal from './components/ProfessorAdderModal.svelte';
	import ProfessorEditorModal from './components/ProfessorEditorModal.svelte';
	import Table from '$components/modules/Table.svelte';
	// IMPORTED STATES
	import { isSMDown } from '$stores/mediaStates';

	// PROPS
	export let data: any;

	// STATES
	let professors: Account[] = [];
	let filteredItems: Account[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// MODAL STATES
	let modalId = generateId();
	let modals = { adder: false, editor: false };
	let target: Account | null = null;

	// MODAL UTILS
	const openAdderModal = () => {
		modals.adder = true;
		createCustomModal(modalId);
	};
	const closeAdderModal = () => {
		modals.adder = false;
		removeCustomModal(modalId);
	};
	const openEditorModal = (account: Account) => {
		createCustomModal(modalId);
		modals.editor = true;
		target = account;
	};
	const closeEditorModal = () => {
		modals.editor = false;
		removeCustomModal(modalId);
	};

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			professors = await selectAccounts({ type: 'professor', search });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleArchive = async (id: string) => {
		isLoading = true;
		const modalId = createLoadingModal({ message: 'Deleting professor account...' });
		try {
			await archiveAccount(id);
			await handleSearch();
			createSuccessModal({ message: 'Professor account was archived successfully!' });
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
		{ icon: 'ph-bold ph-user-list', label: 'Master List', href: '' },
		{ label: 'Professors', href: '/app/master-list/professors' },
	]}
/>

{#if modals.adder}
	<ProfessorAdderModal handleClose={closeAdderModal} {handleSearch} />
{/if}
{#if target}
	{#if modals.editor}
		<ProfessorEditorModal account={target} handleClose={closeEditorModal} {handleSearch} />
	{/if}
{/if}

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
	<Table items={professors} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
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
						<TableBodyCell>{item.last_name}</TableBodyCell>
						<TableBodyCell>{item.first_name}</TableBodyCell>
						<TableBodyCell>{item.middle_name}</TableBodyCell>
						<TableBodyCell class="capitalize">{item.gender}</TableBodyCell>
						<TableBodyCell>{item.contact_number}</TableBodyCell>
						<TableBodyCell>{item.email}</TableBodyCell>
						<TableBodyCell class="flex gap-2">
							<Button
								class="w-[25px] h-[25px] flex-center"
								color="green"
								on:click={() => openEditorModal(item)}
							>
								<i class="ti ti-pencil text-sm" />
							</Button>
							<Button
								class="w-[25px] h-[25px] flex-center"
								color="red"
								on:click={() =>
									createConfirmationModal({
										message:
											'Are you sure you want to archive this professor account?',
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
