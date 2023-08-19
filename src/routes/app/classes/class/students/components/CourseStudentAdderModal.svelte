<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED TYPES
	import type { EnrolleeData } from '$types/master-list';
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	// IMPORTED UTILS
	import { insertCourseStudent, selectEnrollees } from '$utils/supabase';
	import {
		createConfirmationModal,
		createErrorModal,
		createSuccessModal,
	} from '$stores/modalStates';
	// IMPORTED LIB-COMPONENTS
	import {
		Button,
		Modal,
		Badge,
		FloatingLabelInput,
		TableHeadCell,
		TableBodyRow,
		TableBodyCell,
	} from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Table from '$components/modules/Table.svelte';
	import { generateId } from '$utils/helpers';

	// PROPS
	export let handleClose: () => void, handleRefresh: () => Promise<void>;

	// STATES
	let enrollees: EnrolleeData[] = [];
	let filteredItems: EnrolleeData[];
	let startingItem = 0;
	let search = '';
	let isLoading = false;

	// UTILS
	const handleSearch = async () => {
		isLoading = true;
		try {
			enrollees = await selectEnrollees({
				search,
				semester: $page.data.courseClass.semester,
				school_year: $page.data.courseClass.school_year,
				not_in_course_class_id: $page.data.courseClass.id,
			});
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleAdd = async (enrollee: EnrolleeData) => {
		isLoading = true;
		try {
			const id = generateId();
			const created_at = Date.now();
			await insertCourseStudent({
				id,
				course_class_id: $page.data.courseClass.id,
				enrollee_id: enrollee.id,
				search_key: `${enrollee.student_number} ${enrollee.account.full_name} ${enrollee.program.code}`,
				semester: $page.data.courseClass.semester,
				school_year: $page.data.courseClass.school_year,
				grade: '',
				is_grade_released: false,
				created_at,
			});
			await handleSearch();
			await handleRefresh();
			createSuccessModal({ message: 'Course student was added successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};

	// LIFECYCLES
	onMount(handleSearch);
</script>

<Modal open={true} permanent={true} class="w-full" size="xl">
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-plus text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Add Course Student</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<div class="flex flex-col gap-4">
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
		</div>
		<Table items={enrollees} bind:filteredItems bind:startingItem>
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
										color="blue"
										disabled={isLoading}
										on:click={() =>
											createConfirmationModal({
												message:
													'Are you sure you want to add this course student?',
												handleProceed: () => handleAdd(item),
											})}
									>
										<i class="ph-bold ph-plus text-sm" />
									</Button>
								</div>
							</TableBodyCell>
							<TableBodyCell>
								<div
									class="rounded-full border-[2px] p-[2px] w-fit border-blue-600"
								>
									<div
										class="bg-gray-100 w-[35px] h-[35px] rounded-full bg-cover bg-center"
										style="background-image: url({item.account.avatar ||
											NoImagePNG})"
									/>
								</div>
							</TableBodyCell>
							<TableBodyCell>{item.student_number}</TableBodyCell>
							<TableBodyCell>{item.account.last_name}</TableBodyCell>
							<TableBodyCell>{item.account.first_name}</TableBodyCell>
							<TableBodyCell>{item.account.middle_name}</TableBodyCell>
							<TableBodyCell class="capitalize">{item.account.gender}</TableBodyCell>
							<TableBodyCell>{item.account.contact_number}</TableBodyCell>
							<TableBodyCell>{item.account.email}</TableBodyCell>
							<TableBodyCell>{item.program.code}</TableBodyCell>
							<TableBodyCell>{item.year}</TableBodyCell>
							<TableBodyCell>{item.section}</TableBodyCell>
							<TableBodyCell>{item.semester}</TableBodyCell>
							<TableBodyCell>{item.school_year}</TableBodyCell>
							<TableBodyCell>
								{new Date(item.created_at).toDateString()}
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				{/if}
			</svelte:fragment>
		</Table>
	</div>
	<svelte:fragment slot="footer">
		<div class="w-full flex items-center justify-end gap-4">
			<Button size="sm" color="blue" disabled={isLoading} on:click={handleClose}>Done</Button>
		</div>
	</svelte:fragment>
</Modal>

<style lang="scss">
	:global([role='document']) {
		@apply bg-gray-100;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 192 192'%3E%3Cpath fill='%23e5e7eb' fill-opacity='.5' d='M192 15v2a11 11 0 0 0-11 11c0 1.94 1.16 4.75 2.53 6.11l2.36 2.36a6.93 6.93 0 0 1 1.22 7.56l-.43.84a8.08 8.08 0 0 1-6.66 4.13H145v35.02a6.1 6.1 0 0 0 3.03 4.87l.84.43c1.58.79 4 .4 5.24-.85l2.36-2.36a12.04 12.04 0 0 1 7.51-3.11 13 13 0 1 1 .02 26 12 12 0 0 1-7.53-3.11l-2.36-2.36a4.93 4.93 0 0 0-5.24-.85l-.84.43a6.1 6.1 0 0 0-3.03 4.87V143h35.02a8.08 8.08 0 0 1 6.66 4.13l.43.84a6.91 6.91 0 0 1-1.22 7.56l-2.36 2.36A10.06 10.06 0 0 0 181 164a11 11 0 0 0 11 11v2a13 13 0 0 1-13-13 12 12 0 0 1 3.11-7.53l2.36-2.36a4.93 4.93 0 0 0 .85-5.24l-.43-.84a6.1 6.1 0 0 0-4.87-3.03H145v35.02a8.08 8.08 0 0 1-4.13 6.66l-.84.43a6.91 6.91 0 0 1-7.56-1.22l-2.36-2.36A10.06 10.06 0 0 0 124 181a11 11 0 0 0-11 11h-2a13 13 0 0 1 13-13c2.47 0 5.79 1.37 7.53 3.11l2.36 2.36a4.94 4.94 0 0 0 5.24.85l.84-.43a6.1 6.1 0 0 0 3.03-4.87V145h-35.02a8.08 8.08 0 0 1-6.66-4.13l-.43-.84a6.91 6.91 0 0 1 1.22-7.56l2.36-2.36A10.06 10.06 0 0 0 107 124a11 11 0 0 0-22 0c0 1.94 1.16 4.75 2.53 6.11l2.36 2.36a6.93 6.93 0 0 1 1.22 7.56l-.43.84a8.08 8.08 0 0 1-6.66 4.13H49v35.02a6.1 6.1 0 0 0 3.03 4.87l.84.43c1.58.79 4 .4 5.24-.85l2.36-2.36a12.04 12.04 0 0 1 7.51-3.11A13 13 0 0 1 81 192h-2a11 11 0 0 0-11-11c-1.94 0-4.75 1.16-6.11 2.53l-2.36 2.36a6.93 6.93 0 0 1-7.56 1.22l-.84-.43a8.08 8.08 0 0 1-4.13-6.66V145H11.98a6.1 6.1 0 0 0-4.87 3.03l-.43.84c-.79 1.58-.4 4 .85 5.24l2.36 2.36a12.04 12.04 0 0 1 3.11 7.51A13 13 0 0 1 0 177v-2a11 11 0 0 0 11-11c0-1.94-1.16-4.75-2.53-6.11l-2.36-2.36a6.93 6.93 0 0 1-1.22-7.56l.43-.84a8.08 8.08 0 0 1 6.66-4.13H47v-35.02a6.1 6.1 0 0 0-3.03-4.87l-.84-.43c-1.59-.8-4-.4-5.24.85l-2.36 2.36A12 12 0 0 1 28 109a13 13 0 1 1 0-26c2.47 0 5.79 1.37 7.53 3.11l2.36 2.36a4.94 4.94 0 0 0 5.24.85l.84-.43A6.1 6.1 0 0 0 47 84.02V49H11.98a8.08 8.08 0 0 1-6.66-4.13l-.43-.84a6.91 6.91 0 0 1 1.22-7.56l2.36-2.36A10.06 10.06 0 0 0 11 28 11 11 0 0 0 0 17v-2a13 13 0 0 1 13 13c0 2.47-1.37 5.79-3.11 7.53l-2.36 2.36a4.94 4.94 0 0 0-.85 5.24l.43.84A6.1 6.1 0 0 0 11.98 47H47V11.98a8.08 8.08 0 0 1 4.13-6.66l.84-.43a6.91 6.91 0 0 1 7.56 1.22l2.36 2.36A10.06 10.06 0 0 0 68 11 11 11 0 0 0 79 0h2a13 13 0 0 1-13 13 12 12 0 0 1-7.53-3.11l-2.36-2.36a4.93 4.93 0 0 0-5.24-.85l-.84.43A6.1 6.1 0 0 0 49 11.98V47h35.02a8.08 8.08 0 0 1 6.66 4.13l.43.84a6.91 6.91 0 0 1-1.22 7.56l-2.36 2.36A10.06 10.06 0 0 0 85 68a11 11 0 0 0 22 0c0-1.94-1.16-4.75-2.53-6.11l-2.36-2.36a6.93 6.93 0 0 1-1.22-7.56l.43-.84a8.08 8.08 0 0 1 6.66-4.13H143V11.98a6.1 6.1 0 0 0-3.03-4.87l-.84-.43c-1.59-.8-4-.4-5.24.85l-2.36 2.36A12 12 0 0 1 124 13a13 13 0 0 1-13-13h2a11 11 0 0 0 11 11c1.94 0 4.75-1.16 6.11-2.53l2.36-2.36a6.93 6.93 0 0 1 7.56-1.22l.84.43a8.08 8.08 0 0 1 4.13 6.66V47h35.02a6.1 6.1 0 0 0 4.87-3.03l.43-.84c.8-1.59.4-4-.85-5.24l-2.36-2.36A12 12 0 0 1 179 28a13 13 0 0 1 13-13zM84.02 143a6.1 6.1 0 0 0 4.87-3.03l.43-.84c.8-1.59.4-4-.85-5.24l-2.36-2.36A12 12 0 0 1 83 124a13 13 0 1 1 26 0c0 2.47-1.37 5.79-3.11 7.53l-2.36 2.36a4.94 4.94 0 0 0-.85 5.24l.43.84a6.1 6.1 0 0 0 4.87 3.03H143v-35.02a8.08 8.08 0 0 1 4.13-6.66l.84-.43a6.91 6.91 0 0 1 7.56 1.22l2.36 2.36A10.06 10.06 0 0 0 164 107a11 11 0 0 0 0-22c-1.94 0-4.75 1.16-6.11 2.53l-2.36 2.36a6.93 6.93 0 0 1-7.56 1.22l-.84-.43a8.08 8.08 0 0 1-4.13-6.66V49h-35.02a6.1 6.1 0 0 0-4.87 3.03l-.43.84c-.79 1.58-.4 4 .85 5.24l2.36 2.36a12.04 12.04 0 0 1 3.11 7.51A13 13 0 1 1 83 68a12 12 0 0 1 3.11-7.53l2.36-2.36a4.93 4.93 0 0 0 .85-5.24l-.43-.84A6.1 6.1 0 0 0 84.02 49H49v35.02a8.08 8.08 0 0 1-4.13 6.66l-.84.43a6.91 6.91 0 0 1-7.56-1.22l-2.36-2.36A10.06 10.06 0 0 0 28 85a11 11 0 0 0 0 22c1.94 0 4.75-1.16 6.11-2.53l2.36-2.36a6.93 6.93 0 0 1 7.56-1.22l.84.43a8.08 8.08 0 0 1 4.13 6.66V143h35.02z'%3E%3C/path%3E%3C/svg%3E");
	}
</style>
