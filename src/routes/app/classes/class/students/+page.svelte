<script lang="ts">
	// IMPORTED TYPES
	import type { CourseStudentData } from '$types/index';
	import type {
		Column,
		ColumnItem,
		RowItem,
		RowTool,
		SortItem,
		TableTool,
	} from '$components/modules/InteractiveTable';
	// IMPORTED LIB-STORES
	import { page } from '$app/stores';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// IMPORTED UTILS
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
	import { deleteCourseStudent, selectCourseStudents } from '$utils/supabase';
	import { encrypt, decrypt, generateId } from '$utils';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';
	import CourseStudentAdderModal from './components/CourseStudentAdderModal.svelte';

	// PROPS
	export let data: any;

	// MODAL STATES
	let modalId = generateId();
	let modals = { adder: false };

	// MODAL UTILS
	const openAdderModal = () => {
		modals.adder = true;
		createCustomModal(modalId);
	};
	const closeAdderModal = () => {
		modals.adder = false;
		removeCustomModal(modalId);
	};

	// STATES
	let items: CourseStudentData[] = [];
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.classes.class.students';

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
			{ name: 'id', label: 'Student ID', value: item.student_record.account.id },
			{ name: 'last_name', label: 'Last Name', value: item.student_record.account.last_name },
			{
				name: 'first_name',
				label: 'First Name',
				value: item.student_record.account.first_name,
			},
			{
				name: 'middle_name',
				label: 'Middle Name',
				value: item.student_record.account.middle_name,
			},
			{ name: 'gender', label: 'Gender', value: item.student_record.account.gender },
			{
				name: 'contact_number',
				label: 'Contact Number',
				value: item.student_record.account.contact_number,
			},
			{ name: 'email', label: 'Email', value: item.student_record.account.email },
			{ name: 'semester', label: 'Semester', value: item.semester },
			{ name: 'school_year', label: 'School Year', value: item.school_year },
			{ name: 'program', label: 'Program', value: item.student_record.program.code },
			{ name: 'year', label: 'Year', value: item.student_record.year },
			{ name: 'section', label: 'Section', value: item.student_record.section },
			{
				name: 'created_at',
				label: 'Enrolled At',
				value: new Date(item.created_at).toDateString(),
			},
		];
		const tools: RowTool[] = [
			{
				label: 'Delete Student',
				icon: 'ph-bold ph-trash',
				handleClick: () =>
					createConfirmationModal({
						message: 'Are you sure you want to delete this student?',
						handleProceed: () =>
							createVerificationModal({ handleProceed: () => handleDelete(item.id) }),
					}),
			},
		];
		return { columnItems, tools } as RowItem;
	});
	let tableTools: TableTool[] = [{ icon: 'ph-bold ph-plus', handleClick: openAdderModal }];

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
	const handleRefresh = async () => {
		loading = true;
		try {
			items = await selectCourseStudents({
				course_class_id: $page.data.courseClass.id,
				semester: $page.data.courseClass.semester,
				school_year: $page.data.courseClass.school_year,
			});
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};
	const handleDelete = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Deleting student...' });
		try {
			await deleteCourseStudent(id);
			await handleRefresh();
			createSuccessModal({ message: 'Student was deleted successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.courseStudents) items = data.courseStudents;
		loadData();
	});
</script>

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
			label: 'Students',
			href: $page.url.pathname + $page.url.search,
		},
	]}
/>

{#if modals.adder}
	<CourseStudentAdderModal handleClose={closeAdderModal} {handleRefresh} />
{/if}

<InteractiveTable
	bind:columns
	bind:sortItems
	bind:tableTools
	bind:loading
	{...{ rowItems, handleRefresh }}
/>
