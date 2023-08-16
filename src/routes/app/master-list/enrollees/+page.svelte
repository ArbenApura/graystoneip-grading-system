<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED TYPES
	import type { EnrolleeData } from '$types/index';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// IMPORTED UTILS
	import {
		createConfirmationModal,
		createCustomModal,
		createErrorModal,
		createLoadingModal,
		createSuccessModal,
		removeCustomModal,
		removeModal,
	} from '$stores/modalStates';
	import { archiveEnrollee, selectEnrollees } from '$utils/supabase';
	import { generateId } from '$utils/helpers';
	// IMPORTED LIB-COMPONENTS
	import {
		FloatingLabelInput,
		Button,
		TableHeadCell,
		TableBodyRow,
		TableBodyCell,
		Select,
	} from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import Table from '$components/modules/Table.svelte';
	import EnrolleeEditorModal from './components/EnrolleeEditorModal.svelte';

	// PROPS
	export let data: any;

	// STATES
	let semester = '1',
		school_year = '2023-2024';
	let enrollees: EnrolleeData[] = [];
	let filteredItems: EnrolleeData[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// MODAL STATES
	let modalId = generateId();
	let modals = { editor: false };
	let target: EnrolleeData | null = null;

	// MODAL UTILS
	const openEditorModal = (enrollee: EnrolleeData) => {
		createCustomModal(modalId);
		modals.editor = true;
		target = enrollee;
	};
	const closeEditorModal = () => {
		modals.editor = false;
		removeCustomModal(modalId);
	};

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			enrollees = await selectEnrollees({ search, semester, school_year });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleArchive = async (id: string) => {
		isLoading = true;
		const modalId = createLoadingModal({ message: 'Archiving enrollee...' });
		try {
			await archiveEnrollee(id);
			await handleSearch();
			createSuccessModal({ message: 'Enrollee was archived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		isLoading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.enrollees) enrollees = data.enrollees;
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ph-bold ph-user-list', label: 'Master List', href: '' },
		{ label: 'Enrollees', href: '/app/master-list/enrollees' },
	]}
/>

{#if target}
	{#if modals.editor}
		<EnrolleeEditorModal
			enrollee={target.enrollee}
			account={target.account}
			handleClose={closeEditorModal}
			{handleSearch}
		/>
	{/if}
{/if}

<div class="p-4 pt-0 flex flex-col gap-4">
	<div class="flex flex-col md:flex-row items-center justify-between gap-4">
		<form
			class="search w-full md:w-[50%] bg-white rounded-md shadow-md p-2 flex gap-2"
			on:submit|preventDefault={handleSearch}
		>
			<FloatingLabelInput
				style="outlined"
				type="text"
				label="Search..."
				bind:value={search}
			/>
			<Button class="w-[48px] h-[48px]" type="submit" disabled={isLoading}>
				<i class="ti ti-search text-xl" />
			</Button>
		</form>
		<div class="w-full md:w-fit bg-white rounded-md shadow-md p-2 flex gap-2">
			<Select
				placeholder="Select Semester"
				items={[
					{ name: '1st', value: '1' },
					{ name: '2nd', value: '2' },
				]}
				disabled={isLoading}
				bind:value={semester}
				on:change={handleSearch}
			/>
			<Select
				placeholder="Select School Year"
				items={[
					{ name: '2023-2024', value: '2023-2024' },
					{ name: '2024-2025', value: '2024-2025' },
					{ name: '2025-2026', value: '2025-2026' },
					{ name: '2026-2027', value: '2026-2027' },
					{ name: '2027-2028', value: '2027-2028' },
					{ name: '2028-2029', value: '2028-2029' },
					{ name: '2029-2030', value: '2029-2030' },
				]}
				disabled={isLoading}
				bind:value={school_year}
				on:change={handleSearch}
			/>
		</div>
	</div>
	<Table items={enrollees} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Avatar</TableHeadCell>
			<TableHeadCell>Student No.</TableHeadCell>
			<TableHeadCell>Last Name</TableHeadCell>
			<TableHeadCell>First Name</TableHeadCell>
			<TableHeadCell>Middle Name</TableHeadCell>
			<TableHeadCell>Gender</TableHeadCell>
			<TableHeadCell>Contact No.</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell>Program</TableHeadCell>
			<TableHeadCell>Course</TableHeadCell>
			<TableHeadCell>Year</TableHeadCell>
			<TableHeadCell>Section</TableHeadCell>
			<TableHeadCell>Semester</TableHeadCell>
			<TableHeadCell>School Year</TableHeadCell>
			<TableHeadCell>Created At</TableHeadCell>
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
									style="background-image: url({item.account.avatar ||
										NoImagePNG})"
								/>
							</div>
						</TableBodyCell>
						<TableBodyCell>{item.enrollee.student_number}</TableBodyCell>
						<TableBodyCell>{item.account.last_name}</TableBodyCell>
						<TableBodyCell>{item.account.first_name}</TableBodyCell>
						<TableBodyCell>{item.account.middle_name}</TableBodyCell>
						<TableBodyCell class="capitalize">{item.account.gender}</TableBodyCell>
						<TableBodyCell>{item.account.contact_number}</TableBodyCell>
						<TableBodyCell>{item.account.email}</TableBodyCell>
						<TableBodyCell>{item.program.code}</TableBodyCell>
						<TableBodyCell>{item.course.code}</TableBodyCell>
						<TableBodyCell>{item.enrollee.year}</TableBodyCell>
						<TableBodyCell>{item.enrollee.section}</TableBodyCell>
						<TableBodyCell>{item.enrollee.semester}</TableBodyCell>
						<TableBodyCell>{item.enrollee.school_year}</TableBodyCell>
						<TableBodyCell>
							{new Date(item.enrollee.created_at).toDateString()}
						</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-2">
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
												'Are you sure you want to archive this enrollee?',
											handleProceed: () => handleArchive(item.enrollee.id),
										})}
								>
									<i class="ti ti-archive text-sm" />
								</Button>
							</div>
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
