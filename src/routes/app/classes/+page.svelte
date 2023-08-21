<script lang="ts">
	// IMPORTED TYPES
	import type { CourseClassData } from '$types/index';
	// IMPORTED STATES
	import { isMDDown, isSMDown } from '$stores/mediaStates';
	import { isOpen } from '$stores/sidebarStates';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
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
	import {
		deleteCourseClass,
		getCourseClassStudentsCount,
		selectCourseClasses,
	} from '$utils/supabase';
	import { generateId } from '$utils/helpers';
	// IMPORTED LIB-COMPONENTS
	import {
		FloatingLabelInput,
		Button,
		TableHeadCell,
		TableBodyRow,
		TableBodyCell,
		Select,
		Tooltip,
	} from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import Table from '$components/modules/Table.svelte';
	import CourseClassAdderModal from './components/CourseClassAdderModal.svelte';
	import CourseClassEditorModal from './components/CourseClassEditorModal.svelte';

	// PROPS
	export let data: any;

	// STATES
	let semester = '1st',
		school_year = '2023-2024';
	let courseClasses: CourseClassData[] = [];
	let filteredItems: CourseClassData[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// MODAL STATES
	let modalId = generateId();
	let modals = { adder: false, editor: false };
	let target: CourseClassData | null = null;

	// MODAL UTILS
	const openAdderModal = () => {
		modals.adder = true;
		createCustomModal(modalId);
	};
	const closeAdderModal = () => {
		modals.adder = false;
		removeCustomModal(modalId);
	};
	const openEditorModal = (courseClass: CourseClassData) => {
		createCustomModal(modalId);
		modals.editor = true;
		target = courseClass;
	};
	const closeEditorModal = () => {
		modals.editor = false;
		removeCustomModal(modalId);
	};

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			courseClasses = await selectCourseClasses({
				search,
				semester,
				school_year,
				professor_id: $page.data.professor.id,
			});
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleDelete = async (id: string) => {
		isLoading = true;
		const modalId = createLoadingModal({ message: 'Deleting class...' });
		try {
			await deleteCourseClass(id);
			await handleSearch();
			createSuccessModal({ message: 'Class was deleted successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		isLoading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.courseClasses) courseClasses = data.courseClasses;
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ph-bold ph-chalkboard', label: 'Classes', href: '' },
		{ label: $page.data.professor.full_name, href: $page.url.pathname + $page.url.search },
	]}
/>

{#if modals.adder}
	<CourseClassAdderModal handleClose={closeAdderModal} {handleSearch} />
{/if}
{#if target}
	{#if modals.editor}
		<CourseClassEditorModal
			courseClass={target}
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
					{ name: '1st', value: '1st' },
					{ name: '2nd', value: '2nd' },
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
		<Button
			class={`w-[48px] h-[48px] shadow-md ${
				($isSMDown || ($isMDDown && $isOpen)) && 'fixed bottom-[16px] right-[16px] z-20'
			}`}
			pill={true}
			disabled={isLoading}
			on:click={openAdderModal}
		>
			<i class="ti ti-plus text-xl" />
		</Button>
		<Tooltip class="text-xs whitespace-nowrap z-[100]" color="light" placement="left">
			Add Class
		</Tooltip>
	</div>
	<Table items={courseClasses} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Professor</TableHeadCell>
			<TableHeadCell>Students</TableHeadCell>
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
						<TableBodyCell>{item.name}</TableBodyCell>
						<TableBodyCell>{item.professor.full_name}</TableBodyCell>
						<TableBodyCell>
							{#await getCourseClassStudentsCount(item.id)}
								...
							{:then count}
								{count}
							{:catch}
								?
							{/await}
						</TableBodyCell>
						<TableBodyCell>{item.semester}</TableBodyCell>
						<TableBodyCell>{item.school_year}</TableBodyCell>
						<TableBodyCell>
							{new Date(item.created_at).toDateString()}
						</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-2">
								<Button
									class="w-[25px] h-[25px] flex-center"
									href="/app/classes/class?professor_id={item.professor
										.id}&course_class_id={item.id}"
								>
									<i class="ti ti-eye text-sm" />
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
											message: 'Are you sure you want to delete this class?',
											handleProceed: () => handleDelete(item.id),
										})}
								>
									<i class="ph-bold ph-trash text-sm" />
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
