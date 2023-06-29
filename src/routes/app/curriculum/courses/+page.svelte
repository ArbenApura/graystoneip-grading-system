<script lang="ts">
	// IMPORTED TYPES
	import type { Course } from '$types/index';
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
	import CourseAdderModal from './components/CourseAdderModal.svelte';
	import CourseEditorModal from './components/CourseEditorModal.svelte';
	import Table from '$components/modules/Table.svelte';

	// STATES
	let courses: Course[] = [
		{
			id: '1',
			code: 'IT 102',
			prerequisite: '',
			description: 'Introduction to Computing',
			hours: 3,
			units: 3,
			createdAt: Date.now(),
		},
		{
			id: '2',
			code: 'IT 103',
			prerequisite: '',
			description: 'Computer Programming 1',
			hours: 5,
			units: 3,
			createdAt: Date.now(),
		},
		{
			id: '3',
			code: 'IT 104',
			prerequisite: '',
			description: 'Hardware System and Servicing',
			hours: 5,
			units: 3,
			createdAt: Date.now(),
		},
		{
			id: '4',
			code: 'RPH 101',
			prerequisite: '',
			description: 'Reading in Philippine History',
			hours: 3,
			units: 3,
			createdAt: Date.now(),
		},
		{
			id: '5',
			code: 'AAP 101',
			prerequisite: '',
			description: 'Art Appreciation',
			hours: 3,
			units: 3,
			createdAt: Date.now(),
		},
		{
			id: '6',
			code: 'STS 101',
			prerequisite: '',
			description: 'Science, Technology and Society',
			hours: 3,
			units: 3,
			createdAt: Date.now(),
		},
	];
	let filteredItems: Course[];
	let startingItem = 0;
	let modals = { adder: false, editor: false };
	let target: Course | null = null;

	// UTILS
	const openAdderModal = () => (modals.adder = true);
	const closeAdderModal = () => (modals.adder = false);
	const openEditorModal = (course: Course) => {
		modals.editor = true;
		target = course;
	};
	const closeEditorModal = () => (modals.editor = false);
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ti ti-list-details', label: 'Curriculum', href: '' },
		{ label: 'Courses', href: '/app/curriculum/courses' },
	]}
/>

{#if modals.adder}
	<CourseAdderModal handleClose={closeAdderModal} />
{/if}
{#if target}
	{#if modals.editor}
		<CourseEditorModal course={target} handleClose={closeEditorModal} />
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
	<Table items={courses} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Code</TableHeadCell>
			<TableHeadCell>Prerequisite</TableHeadCell>
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
						<TableBodyCell>{item.prerequisite || 'None'}</TableBodyCell>
						<TableBodyCell>{item.description}</TableBodyCell>
						<TableBodyCell>{item.units}</TableBodyCell>
						<TableBodyCell>{item.hours}</TableBodyCell>
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
