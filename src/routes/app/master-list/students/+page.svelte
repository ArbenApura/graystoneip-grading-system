<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED STATES
	import { isSMDown } from '$stores/mediaStates';
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
		Tooltip,
	} from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import StudentAdderModal from './components/StudentAdderModal.svelte';
	import StudentEditorModal from './components/StudentEditorModal.svelte';
	import EnrolleeAdderModal from './components/EnrolleeAdderModal.svelte';
	import Table from '$components/modules/Table.svelte';

	// PROPS
	export let data: any;

	// STATES
	let students: Account[] = [];
	let filteredItems: Account[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// MODAL STATES
	let modalId = generateId();
	let modals = { adder: false, editor: false, enroller: false };
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
	const openEnrollerModal = (account: Account) => {
		createCustomModal(modalId);
		modals.enroller = true;
		target = account;
	};
	const closeEnrollerModal = () => {
		modals.enroller = false;
		removeCustomModal(modalId);
	};

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			students = await selectAccounts({ type: 'student', search });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleArchive = async (id: string) => {
		isLoading = true;
		const modalId = createLoadingModal({ message: 'Archiving student account...' });
		try {
			await archiveAccount(id);
			await handleSearch();
			createSuccessModal({ message: 'Student account was archived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		isLoading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.students) students = data.students;
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ph-bold ph-user-list', label: 'Master List', href: '' },
		{ label: 'Students', href: '/app/master-list/students' },
	]}
/>

{#if modals.adder}
	<StudentAdderModal handleClose={closeAdderModal} {handleSearch} />
{/if}
{#if target}
	{#if modals.editor}
		<StudentEditorModal account={target} handleClose={closeEditorModal} {handleSearch} />
	{/if}
{/if}
{#if target}
	{#if modals.enroller}
		<EnrolleeAdderModal account={target} handleClose={closeEnrollerModal} {handleSearch} />
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
		<Tooltip class="text-xs whitespace-nowrap z-[100]" color="light" placement="left">
			Add Student
		</Tooltip>
	</div>
	<Table items={students} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Tools</TableHeadCell>
			<TableHeadCell>Avatar</TableHeadCell>
			<TableHeadCell>Last Name</TableHeadCell>
			<TableHeadCell>First Name</TableHeadCell>
			<TableHeadCell>Middle Name</TableHeadCell>
			<TableHeadCell>Gender</TableHeadCell>
			<TableHeadCell>Contact No.</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell class="rounded-r-md">Created At</TableHeadCell>
		</svelte:fragment>
		<svelte:fragment slot="table-body">
			{#if filteredItems && filteredItems.length}
				{#each filteredItems as item, i}
					<TableBodyRow>
						<TableBodyCell>{startingItem + 1 + i}</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-2">
								<Button
									class="w-[25px] h-[25px] flex-center"
									href="/app/grades?student_id={item.id}"
								>
									<i class="ph-bold ph-eye text-sm" />
								</Button>
								<Button
									class="w-[25px] h-[25px] flex-center"
									color="yellow"
									on:click={() => openEnrollerModal(item)}
								>
									<i class="ph-bold ph-student text-sm" />
								</Button>
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
												'Are you sure you want to archive this student account?',
											handleProceed: () => handleArchive(item.id),
										})}
								>
									<i class="ti ti-archive text-sm" />
								</Button>
							</div>
						</TableBodyCell>
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
						<TableBodyCell>{new Date(item.created_at).toDateString()}</TableBodyCell>
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
