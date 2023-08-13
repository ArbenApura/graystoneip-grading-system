<script lang="ts">
	// IMPORTED TYPES
	import type { Course } from '$types/index';
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
	import { archiveCourse, selectCourses } from '$utils/supabase';
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
	import CourseAdderModal from './components/CourseAdderModal.svelte';
	import CourseEditorModal from './components/CourseEditorModal.svelte';
	import Table from '$components/modules/Table.svelte';
	// IMPORTED STATES
	import { isSMDown } from '$stores/mediaStates';

	// PROPS
	export let data: any;

	// STATES
	let courses: Course[] = [];
	let filteredItems: Course[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// MODAL STATES
	let modalId = generateId();
	let modals = { adder: false, editor: false };
	let target: Course | null = null;

	// MODAL UTILS
	const openAdderModal = () => {
		modals.adder = true;
		createCustomModal(modalId);
	};
	const closeAdderModal = () => {
		modals.adder = false;
		removeCustomModal(modalId);
	};
	const openEditorModal = (course: Course) => {
		createCustomModal(modalId);
		modals.editor = true;
		target = course;
	};
	const closeEditorModal = () => {
		modals.editor = false;
		removeCustomModal(modalId);
	};

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			courses = await selectCourses({ search });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleArchive = async (id: string) => {
		isLoading = true;
		const modalId = createLoadingModal({ message: 'Archiving course...' });
		try {
			await archiveCourse(id);
			await handleSearch();
			createSuccessModal({ message: 'Course was archived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		isLoading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.courses) courses = data.courses;
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ti ti-list-details', label: 'Curriculum', href: '' },
		{ label: 'Courses', href: '/app/curriculum/courses' },
	]}
/>
{#if modals.adder}
	<CourseAdderModal handleClose={closeAdderModal} {handleSearch} />
{/if}
{#if target}
	{#if modals.editor}
		<CourseEditorModal course={target} handleClose={closeEditorModal} {handleSearch} />
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
				label="Search Codes..."
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
	<Table items={courses} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Code</TableHeadCell>
			<TableHeadCell>Description</TableHeadCell>
			<TableHeadCell>Units</TableHeadCell>
			<TableHeadCell>Hours</TableHeadCell>
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
						<TableBodyCell>{item.units}</TableBodyCell>
						<TableBodyCell>{item.hours}</TableBodyCell>
						<TableBodyCell>{new Date(item.created_at).toDateString()}</TableBodyCell>
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
										message: 'Are you sure you want to archive this course?',
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
