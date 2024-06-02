<script lang="ts">
	// IMPORTED LIB-TYPES
	import type { Row } from 'write-excel-file';
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
	import writeXlsxFile from 'write-excel-file';
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
	import { archiveStudentRecord, selectStudentRecords } from '$utils/supabase';
	import { encrypt, decrypt, generateId } from '$utils';
	// IMPORTED LIB-COMPONENTS
	import { Button, Tooltip } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';
	import StudentRecordEditorModal from './components/StudentRecordEditorModal.svelte';
	import { getDefaultFilter } from '$utils/config';
	import { filter } from 'lodash';

	// PROPS
	export let data: any;

	// MODAL STATES
	let modalId = generateId();
	let modals = { editor: false };
	let target: StudentRecordData | null = null;

	// MODAL UTILS
	const openEditorModal = (studentRecord: StudentRecordData) => {
		createCustomModal(modalId);
		modals.editor = true;
		target = studentRecord;
	};
	const closeEditorModal = () => {
		modals.editor = false;
		removeCustomModal(modalId);
	};

	// STATES
	let items: StudentRecordData[] = [];
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.master-list.student-records_v1';

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
				{ label: '1st', match: '1st', active: false },
				{ label: '2nd', match: '2nd', active: false },
			],
		},
		{
			label: 'School Year',
			name: 'school_year',
			items: [
				{ label: '2023-2024', match: '2023-2024', active: false },
				{ label: '2024-2025', match: '2024-2025', active: false },
				{ label: '2025-2026', match: '2025-2026', active: false },
				{ label: '2026-2027', match: '2026-2027', active: false },
				{ label: '2027-2028', match: '2027-2028', active: false },
			],
		},
	];
	$: rowItems = items.map((item) => {
		const columnItems: ColumnItem[] = [
			{ name: 'id', label: 'Student ID', value: item.account.id },
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
				label: 'Edit Student Record',
				icon: 'ph-bold ph-pen',
				handleClick: () => openEditorModal(item),
			},
			{
				label: 'Archive Student Record',
				icon: 'ph-bold ph-archive',
				handleClick: () =>
					createConfirmationModal({
						message: 'Are you sure you want to archive this Student Record?',
						handleProceed: () => handleArchive(item.id),
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
	const handleRefresh = async () => {
		loading = true;
		try {
			items = await selectStudentRecords({});
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};
	const handleArchive = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Archiving Student Record...' });
		try {
			await archiveStudentRecord(id);
			await handleRefresh();
			createSuccessModal({ message: 'Student Record was archived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};
	const handleExport = async () => {
		try {
			const tableEl = document.querySelector('table') as HTMLTableElement;
			if (!tableEl) throw new Error('Failed to get table data!');
			const rows: Row[] = [];
			for (let i = 0; i < tableEl.rows.length; i++) {
				const row = tableEl.rows[i];
				const row_data: Row = [];
				for (let j = 0; j < row.cells.length; j++) {
					const cell = row.cells[j];
					if (j === 1 || j === 2) continue;
					row_data.push({
						value: cell.innerText,
						type: String,
						fontWeight: i === 0 ? 'bold' : undefined,
						backgroundColor: i === 0 ? '#60a5fa' : undefined,
					});
				}
				rows.push(row_data);
			}
			await writeXlsxFile([...rows], { fileName: `StudentRecords.xlsx` });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
	};

	// LIFECYCLES
	onMount(() => {
		if (data.studentRecords) items = data.studentRecords;

		loadData();

		const defaultFilter = getDefaultFilter();

		filterGroups = filterGroups.map((filterGroup) => {
			if (filterGroup.name === 'semester') {
				filterGroup.items = filterGroup.items.map((item) => {
					item.active = item.match === defaultFilter.semester;
					return item;
				});
			}

			if (filterGroup.name === 'school_year') {
				filterGroup.items = filterGroup.items.map((item) => {
					item.active = item.match === defaultFilter.school_year;
					return item;
				});
			}

			return filterGroup;
		});
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ph-bold ph-user-list', label: 'Master List', href: '' },
		{ label: 'Student Records', href: '/app/master-list/student-records' },
	]}
/>

{#if target}
	{#if modals.editor}
		<StudentRecordEditorModal
			studentRecord={target}
			handleClose={closeEditorModal}
			{handleRefresh}
		/>
	{/if}
{/if}

<Button
	class={`w-[48px] h-[48px] shadow-md fixed bottom-[16px] right-[16px] z-20}`}
	pill={true}
	disabled={loading}
	on:click={() =>
		createConfirmationModal({
			message: 'Are you sure you want to export the Student Records?',
			handleProceed: handleExport,
		})}
>
	<i class="ph-bold ph-export text-xl" />
</Button>
<Tooltip class="text-xs whitespace-nowrap z-[100]" color="light" placement="left">Export</Tooltip>

<InteractiveTable
	bind:columns
	bind:sortItems
	bind:filterGroups
	bind:loading
	{...{ rowItems, handleRefresh }}
/>
