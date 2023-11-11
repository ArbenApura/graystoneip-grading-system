<script lang="ts">
	// IMPORTED TYPES
	import type { StudentRecordData } from '$types/index';
	import type {
		Column,
		ColumnItem,
		RowItem,
		RowTool,
		SortItem,
		FilterGroup,
	} from '$components/modules/InteractiveTable';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// IMPORTED UTILS
	import {
		createConfirmationModal,
		createErrorModal,
		createLoadingModal,
		createSuccessModal,
		createVerificationModal,
		removeModal,
	} from '$stores/modalStates';
	import { unarchiveStudentRecord, selectStudentRecords } from '$utils/supabase';
	import { encrypt, decrypt } from '$utils';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';

	// PROPS
	export let data: any;

	// STATES
	let items: StudentRecordData[] = [];
	let search = '';
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.archive.studentRecords';

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
	let filterGroups: FilterGroup[] = [
		{
			label: 'Semester',
			name: 'semester',
			items: [
				{ label: '1st', match: '1st', active: true },
				{ label: '2nd', match: '2nd', active: false },
			],
		},
		{
			label: 'School Year',
			name: 'school_year',
			items: [
				{ label: '2023-2024', match: '2023-2024', active: true },
				{ label: '2024-2025', match: '2024-2025', active: false },
				{ label: '2025-2026', match: '2025-2026', active: false },
				{ label: '2026-2027', match: '2026-2027', active: false },
				{ label: '2027-2028', match: '2027-2028', active: false },
			],
		},
	];
	$: rowItems = items.map((item) => {
		const columnItems: ColumnItem[] = [
			{ name: 'id', label: 'Student ID', value: item.id },
			{ name: 'last_name', label: 'Last Name', value: item.account.last_name },
			{ name: 'first_name', label: 'First Name', value: item.account.first_name },
			{ name: 'middle_name', label: 'Middle Name', value: item.account.middle_name },
			{ name: 'gender', label: 'Gender', value: item.account.gender },
			{ name: 'contact_number', label: 'Contact Number', value: item.account.contact_number },
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
				label: 'Unarchive StudentRecord',
				icon: 'ph-bold ph-arrow-counter-clockwise',
				handleClick: () =>
					createConfirmationModal({
						message: 'Are you sure you want to unarchive this studentRecord account?',
						handleProceed: () =>
							createVerificationModal({
								handleProceed: () => handleUnarchive(item.id),
							}),
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
		filterGroups;
		saveData();
	}

	// UTILS
	const saveData = () => {
		if (typeof localStorage === 'undefined' || !initialized) return;
		const data = JSON.stringify({ columns, sortItems, filterGroups });
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
			if (data.filterGroups) filterGroups = data.filterGroups;
		} catch {}
		initialized = true;
	};
	const handleRefresh = async () => {
		loading = true;
		try {
			items = await selectStudentRecords({ search, is_archived: true });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};
	const handleUnarchive = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Unarchiving studentRecord...' });
		try {
			await unarchiveStudentRecord(id);
			await handleRefresh();
			createSuccessModal({ message: 'StudentRecord account was unarchived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.studentRecords) items = data.studentRecords;
		loadData();
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ti ti-archive', label: 'Archive', href: '' },
		{ label: 'StudentRecords', href: '/app/archive/studentRecords' },
	]}
/>

<InteractiveTable
	bind:columns
	bind:sortItems
	bind:filterGroups
	bind:loading
	{...{ rowItems, handleRefresh }}
/>
