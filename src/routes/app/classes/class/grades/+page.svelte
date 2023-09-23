<script lang="ts">
	// IMPORTED TYPES
	import type {
		AdvanceCriteria,
		CourseStudentData,
		CriteriaData,
		CriteriaGradeData,
	} from '$types/curriculum';
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	// IMPORTED UTILS
	import { generateId } from '$utils/helpers';
	import { createCustomModal, createErrorModal, removeCustomModal } from '$stores/modalStates';
	import {
		selectAdvanceCriterias,
		selectCourseStudents,
		selectCriteriaGrades,
	} from '$utils/supabase';
	// IMPORTED LIB-COMPONENTS
	import { FloatingLabelInput, Button, Select, Tooltip } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import Table from './components/Table.svelte';
	import CombinedTable from './components/CombinedTable.svelte';
	import CriteriaAdderModal from './components/CriteriaAdderModal.svelte';
	import CriteriaEditorModal from './components/CriteriaEditorModal.svelte';

	// STATES
	let course_students = ($page.data.course_students as CourseStudentData[]) || [];
	let advance_criterias = ($page.data.advance_criterias as AdvanceCriteria[]) || [];
	let criteria_grades = ($page.data.criteria_grades as CriteriaGradeData[]) || [];
	let term = 'MID TERM';
	let search = '';
	let isLoading = false;

	// MODAL STATES
	let modalId = generateId();
	let modals = { criteriaAdder: false, criteriaEditor: false };
	let criteriaTarget: CriteriaData | null = null;

	// MODAL UTILS
	const openCriteriaAdderModal = () => {
		modals.criteriaAdder = true;
		createCustomModal(modalId);
	};
	const closeCriteriaAdderModal = () => {
		modals.criteriaAdder = false;
		removeCustomModal(modalId);
	};
	const openCriteriaEditorModal = (criteria: CriteriaData) => {
		createCustomModal(modalId);
		modals.criteriaEditor = true;
		criteriaTarget = criteria;
	};
	const closeCriteriaEditorModal = () => {
		modals.criteriaEditor = false;
		removeCustomModal(modalId);
	};

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			await Promise.all([
				(course_students = await selectCourseStudents({
					search,
					course_class_id: $page.data.courseClass.id,
				})),
				(advance_criterias = await selectAdvanceCriterias({
					term,
					course_class_id: $page.data.courseClass.id,
				})),
				(criteria_grades = await selectCriteriaGrades({
					course_class_id: $page.data.courseClass.id,
				})),
			]);
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
</script>

{#if modals.criteriaAdder}
	<CriteriaAdderModal handleClose={closeCriteriaAdderModal} {handleSearch} {term} />
{/if}

{#if criteriaTarget && modals.criteriaEditor}
	<CriteriaEditorModal
		handleClose={closeCriteriaEditorModal}
		criteria={criteriaTarget}
		{handleSearch}
	/>
{/if}

<Header
	breadcrumbItems={[
		{
			icon: 'ph-bold ph-chalkboard',
			label: 'Classes',
			href: '/app/classes?instructor_id=' + $page.data.instructor.id,
		},
		{
			label: $page.data.instructor.full_name,
			href: '/app/classes?instructor_id=' + $page.data.instructor.id,
		},
		{
			label: $page.data.courseClass.name,
			href:
				'/app/classes/class?instructor_id=' +
				$page.data.instructor.id +
				'&course_class_id=' +
				$page.data.courseClass.id,
		},
		{
			label: 'Grades',
			href: $page.url.pathname + $page.url.search,
		},
	]}
/>

{#if term === 'MID TERM' || term === 'FINAL TERM'}
	<Button
		class={`w-[48px] h-[48px] shadow-md fixed bottom-[16px] right-[16px] z-20}`}
		pill={true}
		disabled={isLoading}
		on:click={openCriteriaAdderModal}
	>
		<i class="ti ti-plus text-xl" />
	</Button>
	<Tooltip class="text-xs whitespace-nowrap z-[100]" color="light" placement="left"
		>Add Criteria</Tooltip
	>
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
			<Button
				class="w-[48px] h-[48px]"
				type="submit"
				disabled={isLoading}
				on:click={handleSearch}
			>
				<i class="ti ti-search text-xl" />
			</Button>
		</form>
		<div class="w-full md:w-fit bg-white rounded-md shadow-md p-2 flex gap-2">
			<Select
				placeholder="Select School Year"
				items={[
					{ name: 'MID TERM', value: 'MID TERM' },
					{ name: 'FINAL TERM', value: 'FINAL TERM' },
					{ name: 'COMBINED', value: 'COMBINED' },
				]}
				disabled={isLoading}
				bind:value={term}
				on:change={handleSearch}
			/>
		</div>
	</div>
	<div class="bg-white shadow-md rounded-md p-4">
		{#if term === 'MID TERM' || term === 'FINAL TERM'}
			<Table
				{course_students}
				{advance_criterias}
				{criteria_grades}
				{term}
				{isLoading}
				{openCriteriaEditorModal}
				{handleSearch}
			/>
		{:else}
			<CombinedTable {course_students} {advance_criterias} {criteria_grades} {isLoading} />
		{/if}
	</div>
</div>

<style lang="scss">
	:global(.search > div) {
		flex-grow: 1;
	}
</style>
