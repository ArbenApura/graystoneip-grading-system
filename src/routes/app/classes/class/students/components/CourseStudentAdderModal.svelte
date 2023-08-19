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
	<div class="mx-[-24px] my-[-24px] p-4 flex flex-col gap-4 bg-pattern">
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
