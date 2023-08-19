<script lang="ts">
	// IMPORTED TYPES
	import type { CourseStudentData } from '$types/index';
	// IMPORTED UTILS
	import { page } from '$app/stores';
	import { selectCourseStudents } from '$utils/supabase';
	import { createErrorModal } from '$stores/modalStates';
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

	// STATES
	let semester = $page.url.searchParams.get('semester') || '1st',
		school_year = $page.url.searchParams.get('school_year') || '2023-2024';
	let courseStudents: CourseStudentData[] = $page.data.courseStudents || [];
	let filteredItems: CourseStudentData[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			courseStudents = await selectCourseStudents({
				search,
				semester,
				school_year,
				student_id: $page.data.student.id,
			});
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
</script>

<Header
	breadcrumbItems={[
		{
			icon: 'ph-bold ph-exam',
			label: 'Grades',
			href: '/app/grades?student_id=' + $page.data.student.id,
		},
	]}
/>

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
	</div>
	<Table items={courseStudents} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Professor</TableHeadCell>
			<TableHeadCell>Course Code</TableHeadCell>
			<TableHeadCell>Course Description</TableHeadCell>
			<TableHeadCell>Grade</TableHeadCell>
			<TableHeadCell>Semester</TableHeadCell>
			<TableHeadCell class="rounded-r-md">School Year</TableHeadCell>
		</svelte:fragment>
		<svelte:fragment slot="table-body">
			{#if filteredItems && filteredItems.length}
				{#each filteredItems as item, i}
					<TableBodyRow>
						<TableBodyCell>{startingItem + 1 + i}</TableBodyCell>
						<TableBodyCell>{item.course_class.name}</TableBodyCell>
						<TableBodyCell>{item.course_class.professor.full_name}</TableBodyCell>
						<TableBodyCell>{item.course_class.course.code}</TableBodyCell>
						<TableBodyCell>{item.course_class.course.description}</TableBodyCell>
						<TableBodyCell
							>{item.is_grade_released
								? item.grade
								: 'Not Yet Released'}</TableBodyCell
						>
						<TableBodyCell>{item.semester}</TableBodyCell>
						<TableBodyCell>{item.school_year}</TableBodyCell>
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
