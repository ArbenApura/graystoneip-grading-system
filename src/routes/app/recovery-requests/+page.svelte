<script lang="ts">
	// IMPORTED TYPES
	import type { RecoveryRequestData } from '$types/index';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// IMPORTED UTILS
	import { generateId } from '$utils/helpers';
	import {
		createCustomModal,
		createErrorModal,
		removeCustomModal,
		createInfoModal,
		createConfirmationModal,
	} from '$stores/modalStates';
	import { deleteRecoveryRequest, selectRecoveryRequests } from '$utils/supabase';
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
	let recoveryRequests: RecoveryRequestData[] = [];
	let filteredItems: RecoveryRequestData[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// MODAL STATES
	let modalId = generateId();
	let modals = { adder: false, editor: false };
	let target: RecoveryRequestData | null = null;

	// MODAL UTILS
	const openAdderModal = () => {
		modals.adder = true;
		createCustomModal(modalId);
	};
	const closeAdderModal = () => {
		modals.adder = false;
		removeCustomModal(modalId);
	};
	const openEditorModal = (recoveryRequest: RecoveryRequestData) => {
		createCustomModal(modalId);
		modals.editor = true;
		target = recoveryRequest;
	};
	const closeEditorModal = () => {
		modals.editor = false;
		removeCustomModal(modalId);
	};

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			recoveryRequests = await selectRecoveryRequests({ search });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleDelete = async (id: string) => {
		isLoading = true;
		try {
			await deleteRecoveryRequest(id);
			await handleSearch();
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.recoveryRequests) recoveryRequests = data.recoveryRequests;
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ph-bold ph-arrow-counter-clockwise', label: 'Recovery Requests', href: '' },
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
				label="Search Emails..."
				bind:value={search}
			/>
			<Button class="w-[48px] h-[48px]" type="submit" disabled={isLoading}>
				<i class="ti ti-search text-xl" />
			</Button>
		</form>
	</div>
	<Table items={recoveryRequests} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell>Created At</TableHeadCell>
			<TableHeadCell class="rounded-r-md">Tools</TableHeadCell>
		</svelte:fragment>
		<svelte:fragment slot="table-body">
			{#if filteredItems && filteredItems.length}
				{#each filteredItems as item, i}
					<TableBodyRow>
						<TableBodyCell>{startingItem + 1 + i}</TableBodyCell>
						<TableBodyCell>{item.recoveryRequest.email}</TableBodyCell>
						<TableBodyCell>
							{new Date(item.recoveryRequest.created_at).toDateString()}
						</TableBodyCell>
						<TableBodyCell class="flex gap-2">
							<Button
								class="w-[25px] h-[25px] flex-center"
								on:click={() =>
									createInfoModal({
										message: `Please send the account information to the corresponding email address of the recovery request. [Email: ${item.account.email}, Password: ${item.account.password}]`,
									})}
							>
								<i class="ph-bold ph-paper-plane-right text-sm" />
							</Button>
							<Button
								class="w-[25px] h-[25px] flex-center"
								color="red"
								on:click={() =>
									createConfirmationModal({
										message:
											'Are you sure you want to delete this recovery request?',
										handleProceed: async () =>
											await handleDelete(item.recoveryRequest.id),
									})}
							>
								<i class="ph-bold ph-trash text-sm" />
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
