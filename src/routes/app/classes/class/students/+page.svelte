<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED TYPES
	import type { CourseStudentData } from '$types/index';
	// IMPORTED STATES
	import { isSMDown } from '$stores/mediaStates';
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	// IMPORTED UTILS
	import {
		createConfirmationModal,
		createCustomModal,
		createErrorModal,
		createSuccessModal,
		removeCustomModal,
	} from '$stores/modalStates';
	import { deleteCourseStudent, selectCourseStudents } from '$utils/supabase';
	import { generateId } from '$utils/helpers';
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
	import Table from '$components/modules/Table.svelte';
	import CourseStudentAdderModal from './components/CourseStudentAdderModal.svelte';

	// STATES
	let courseStudents: CourseStudentData[] = $page.data.courseStudents || [];
	let filteredItems: CourseStudentData[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// MODAL STATES
	let modalId = generateId();
	let modals = { adder: false };
	let target: CourseStudentData | null = null;

	// MODAL UTILS
	const openAdderModal = () => {
		modals.adder = true;
		createCustomModal(modalId);
	};
	const closeAdderModal = () => {
		modals.adder = false;
		removeCustomModal(modalId);
	};

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			courseStudents = await selectCourseStudents({
				search,
				course_class_id: $page.data.courseClass.id,
			});
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleDelete = async (id: string) => {
		isLoading = true;
		try {
			await deleteCourseStudent(id);
			await handleSearch();
			createSuccessModal({ message: 'Course student was deleted successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
</script>

<Header
	breadcrumbItems={[
		{
			icon: 'ph-bold ph-chalkboard',
			label: 'Classes',
			href: '/app/classes?professor_id=' + $page.data.professor.id,
		},
		{
			label: $page.data.professor.full_name,
			href: '/app/classes?professor_id=' + $page.data.professor.id,
		},
		{
			label: $page.data.courseClass.name,
			href:
				'/app/classes/class?professor_id=' +
				$page.data.professor.id +
				'&course_class_id=' +
				$page.data.courseClass.id,
		},
		{
			label: 'Students',
			href: $page.url.pathname + $page.url.search,
		},
	]}
/>

{#if modals.adder}
	<CourseStudentAdderModal handleClose={closeAdderModal} handleRefresh={handleSearch} />
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
	<Table items={courseStudents} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Tools</TableHeadCell>
			<TableHeadCell>Avatar</TableHeadCell>
			<TableHeadCell>Student No.</TableHeadCell>
			<TableHeadCell>Last Name</TableHeadCell>
			<TableHeadCell>First Name</TableHeadCell>
			<TableHeadCell>Middle Name</TableHeadCell>
			<TableHeadCell>Gender</TableHeadCell>
			<TableHeadCell>Contact No.</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell>Program</TableHeadCell>
			<TableHeadCell>Year</TableHeadCell>
			<TableHeadCell>Section</TableHeadCell>
			<TableHeadCell>Semester</TableHeadCell>
			<TableHeadCell>School Year</TableHeadCell>
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
									color="red"
									on:click={() =>
										createConfirmationModal({
											message:
												'Are you sure you want to delete this course student?',
											handleProceed: () => handleDelete(item.id),
										})}
								>
									<i class="ph-bold ph-trash text-sm" />
								</Button>
							</div>
						</TableBodyCell>
						<TableBodyCell>
							<div class="rounded-full border-[2px] p-[2px] w-fit border-blue-600">
								<div
									class="bg-gray-100 w-[35px] h-[35px] rounded-full bg-cover bg-center"
									style="background-image: url({item.enrollee.account.avatar ||
										NoImagePNG})"
								/>
							</div>
						</TableBodyCell>
						<TableBodyCell>{item.enrollee.student_number}</TableBodyCell>
						<TableBodyCell>{item.enrollee.account.last_name}</TableBodyCell>
						<TableBodyCell>{item.enrollee.account.first_name}</TableBodyCell>
						<TableBodyCell>{item.enrollee.account.middle_name}</TableBodyCell>
						<TableBodyCell class="capitalize"
							>{item.enrollee.account.gender}</TableBodyCell
						>
						<TableBodyCell>{item.enrollee.account.contact_number}</TableBodyCell>
						<TableBodyCell>{item.enrollee.account.email}</TableBodyCell>
						<TableBodyCell>{item.enrollee.program.code}</TableBodyCell>
						<TableBodyCell>{item.enrollee.year}</TableBodyCell>
						<TableBodyCell>{item.enrollee.section}</TableBodyCell>
						<TableBodyCell>{item.enrollee.semester}</TableBodyCell>
						<TableBodyCell>{item.enrollee.school_year}</TableBodyCell>
						<TableBodyCell>
							{new Date(item.created_at).toDateString()}
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
