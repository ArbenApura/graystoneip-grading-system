<script lang="ts">
	// IMPORTED TYPES
	import type { EnrolleeData } from '$types/master-list';
	import type {
		Column,
		ColumnItem,
		RowItem,
		RowTool,
		SortItem,
	} from '$components/modules/InteractiveTable';
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
	import { encrypt, decrypt, generateId } from '$utils';
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, Badge } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';

	// PROPS
	export let handleClose: () => void, handleRefresh: () => Promise<void>;

	// STATES
	let items: EnrolleeData[] = [];
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.classes.class.students.modal.adder';

	// TABLE STATES
	let columns: Column[] = [
		{ name: 'id', label: 'Student ID', visible: true },
		{ name: 'last_name', label: 'Last Name', visible: true },
		{ name: 'first_name', label: 'First Name', visible: true },
		{ name: 'middle_name', label: 'Middle Name', visible: true },
		{ name: 'gender', label: 'Gender', visible: true },
		{ name: 'contact_number', label: 'Contact Number', visible: true },
		{ name: 'email', label: 'Email', visible: true },
		{ name: 'semester', label: 'Semester', visible: true },
		{ name: 'school_year', label: 'School Year', visible: true },
		{ name: 'program', label: 'Program', visible: true },
		{ name: 'year', label: 'Year', visible: true },
		{ name: 'section', label: 'Section', visible: true },
		{ name: 'created_at', label: 'Enrolled At', visible: true },
	];
	let sortItems: SortItem[] = [
		{ name: 'id', label: 'Student ID', type: 'none' },
		{ name: 'last_name', label: 'Last Name', type: 'asc' },
		{ name: 'first_name', label: 'First Name', type: 'none' },
		{ name: 'middle_name', label: 'Middle Name', type: 'none' },
		{ name: 'gender', label: 'Gender', type: 'none' },
		{ name: 'contact_number', label: 'Contact Number', type: 'none' },
		{ name: 'email', label: 'Email', type: 'none' },
		{ name: 'semester', label: 'Semester', type: 'none' },
		{ name: 'school_year', label: 'School Year', type: 'none' },
		{ name: 'program', label: 'Program', type: 'none' },
		{ name: 'year', label: 'Year', type: 'none' },
		{ name: 'section', label: 'Section', type: 'none' },
		{ name: 'created_at', label: 'Enrolled At', type: 'none' },
	];
	$: rowItems = items.map((item) => {
		const columnItems: ColumnItem[] = [
			{ name: 'id', label: 'Student ID', value: item.account.id },
			{ name: 'last_name', label: 'Last Name', value: item.account.last_name },
			{ name: 'first_name', label: 'First Name', value: item.account.first_name },
			{ name: 'middle_name', label: 'Middle Name', value: item.account.middle_name },
			{ name: 'gender', label: 'Gender', value: item.account.gender },
			{
				name: 'contact_number',
				label: 'Contact Number',
				value: item.account.contact_number,
			},
			{ name: 'email', label: 'Email', value: item.account.email },
			{ name: 'semester', label: 'Semester', value: item.semester },
			{ name: 'school_year', label: 'School Year', value: item.school_year },
			{ name: 'program', label: 'Program', value: item.program.code },
			{ name: 'year', label: 'Year', value: item.year },
			{ name: 'section', label: 'Section', value: item.section },
			{
				name: 'created_at',
				label: 'Enrolled At',
				value: new Date(item.created_at).toDateString(),
			},
		];
		const tools: RowTool[] = [
			{
				label: 'Add Student',
				icon: 'ph-bold ph-plus',
				handleClick: () =>
					createConfirmationModal({
						message: 'Are you sure you want to add this student?',
						handleProceed: () => handleAdd(item),
					}),
			},
		];
		return { columnItems, tools } as RowItem;
	});

	// REACTIVE STATES
	$: {
		// SAVE CHANGES TO LOCAL STORAGES
		columns;
		sortItems;
		saveData();
	}

	// UTILS
	const saveData = () => {
		if (typeof localStorage === 'undefined' || !initialized) return;
		const data = JSON.stringify({ columns, sortItems });
		const encrypted = encrypt(data);
		localStorage.setItem(localStorageKey, encrypted);
	};
	const loadData = () => {
		try {
			if (typeof localStorage === 'undefined') throw new Error();
			const encrypted = localStorage.getItem(localStorageKey);
			if (!encrypted) throw new Error();
			const decrypted = decrypt(encrypted);
			if (!decrypted) throw new Error();
			const data = JSON.parse(decrypted);
			if (data.columns) columns = data.columns;
			if (data.sortItems) sortItems = data.sortItems;
		} catch {}
		initialized = true;
	};
	const handleSearch = async () => {
		loading = true;
		try {
			items = await selectEnrollees({
				semester: $page.data.courseClass.semester,
				school_year: $page.data.courseClass.school_year,
				not_in_course_class_id: $page.data.courseClass.id,
			});
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};
	const handleAdd = async (enrollee: EnrolleeData) => {
		loading = true;
		try {
			const id = generateId();
			const created_at = Date.now();
			await insertCourseStudent({
				id,
				course_class_id: $page.data.courseClass.id,
				enrollee_id: enrollee.id,
				search_key: `${enrollee.account.full_name} ${enrollee.program.code}`,
				semester: $page.data.courseClass.semester,
				school_year: $page.data.courseClass.school_year,
				grade: '',
				is_grade_released: false,
				created_at,
			});
			await handleSearch();
			await handleRefresh();
			createSuccessModal({ message: 'Student was added successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};

	// LIFECYCLES
	onMount(() => {
		loadData();
		handleSearch();
	});
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
		<InteractiveTable
			toolPosition="front"
			bind:columns
			bind:sortItems
			bind:loading
			{...{ rowItems, handleRefresh }}
		/>
	</div>
	<svelte:fragment slot="footer">
		<div class="w-full flex items-center justify-end gap-4">
			<Button size="sm" color="blue" disabled={loading} on:click={handleClose}>Done</Button>
		</div>
	</svelte:fragment>
</Modal>
