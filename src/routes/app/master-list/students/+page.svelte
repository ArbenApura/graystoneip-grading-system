<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	import type {
		Column,
		ColumnItem,
		RowItem,
		RowTool,
		SortItem,
		TableTool,
	} from '$components/modules/InteractiveTable';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// IMPORTED UTILS
	import {
		createConfirmationModal,
		createCustomModal,
		createErrorModal,
		createLoadingModal,
		createSuccessModal,
		removeCustomModal,
		removeModal,
	} from '$stores/modalStates';
	import { selectAccounts, archiveAccount } from '$utils/supabase';
	import { generateId, encrypt, decrypt } from '$utils';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';
	import StudentAdderModal from './components/StudentAdderModal.svelte';
	import StudentEditorModal from './components/StudentEditorModal.svelte';
	import StudentRecordAdderModal from './components/StudentRecordAdderModal.svelte';

	// PROPS
	export let data: any;

	// MODAL STATES
	let modalId = generateId();
	let modals = { adder: false, editor: false, enroller: false };
	let target: Account | null = null;

	// MODAL UTILS
	const openAdderModal = () => {
		modals.adder = true;
		createCustomModal(modalId);
	};
	const closeAdderModal = () => {
		modals.adder = false;
		removeCustomModal(modalId);
	};
	const openEditorModal = (account: Account) => {
		createCustomModal(modalId);
		modals.editor = true;
		target = account;
	};
	const closeEditorModal = () => {
		modals.editor = false;
		removeCustomModal(modalId);
	};
	const openEnrollerModal = (account: Account) => {
		createCustomModal(modalId);
		modals.enroller = true;
		target = account;
	};
	const closeEnrollerModal = () => {
		modals.enroller = false;
		removeCustomModal(modalId);
	};

	// STATES
	let items: Account[] = [];
	let search = '';
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.master-list.students';

	// TABLE STATES
	let columns: Column[] = [
		{ name: 'id', label: 'Student ID', visible: true },
		{ name: 'last_name', label: 'Last Name', visible: true },
		{ name: 'first_name', label: 'First Name', visible: true },
		{ name: 'middle_name', label: 'Middle Name', visible: true },
		{ name: 'gender', label: 'Gender', visible: true },
		{ name: 'contact_number', label: 'Contact Nmber', visible: true },
		{ name: 'email', label: 'Email', visible: true },
		{ name: 'created_at', label: 'Created At', visible: true },
	];
	let sortItems: SortItem[] = [
		{ name: 'id', label: 'Student ID', type: 'none' },
		{ name: 'last_name', label: 'Last Name', type: 'asc' },
		{ name: 'email', label: 'Email', type: 'none' },
		{ name: 'created_at', label: 'Created At', type: 'none' },
	];
	$: rowItems = items.map((item) => {
		const columnItems: ColumnItem[] = [
			{ name: 'id', label: 'Student ID', value: item.id },
			{ name: 'last_name', label: 'Last Name', value: item.last_name },
			{ name: 'first_name', label: 'First Name', value: item.first_name },
			{ name: 'middle_name', label: 'Middle Name', value: item.middle_name },
			{ name: 'gender', label: 'Gender', value: item.gender },
			{ name: 'contact_number', label: 'Contact Nmber', value: item.contact_number },
			{ name: 'email', label: 'Email', value: item.email },
			{
				name: 'created_at',
				label: 'Created At',
				value: new Date(item.created_at).toDateString(),
			},
		];
		const tools: RowTool[] = [
			{
				label: 'View Student Info',
				icon: 'ph-bold ph-eye',
				href: `/app/grades?student_id=${item.id}`,
			},
			{
				label: 'Add New Record',
				icon: 'ph-bold ph-student',
				handleClick: () => openEnrollerModal(item),
			},
			{
				label: 'Edit Student',
				icon: 'ph-bold ph-pen',
				handleClick: () => openEditorModal(item),
			},
			{
				label: 'Archive Student',
				icon: 'ph-bold ph-archive',
				handleClick: () =>
					createConfirmationModal({
						message: 'Are you sure you want to archive this student account?',
						handleProceed: () => handleArchive(item.id),
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
			items = await selectAccounts({ type: 'student', search });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};
	const handleArchive = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Archiving student account...' });
		try {
			await archiveAccount(id);
			await handleRefresh();
			createSuccessModal({ message: 'Student account was archived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.students) items = data.students;
		loadData();
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ph-bold ph-user-list', label: 'Master List', href: '' },
		{ label: 'Students', href: '/app/master-list/students' },
	]}
/>

{#if modals.adder}
	<StudentAdderModal handleClose={closeAdderModal} {handleRefresh} />
{/if}
{#if target}
	{#if modals.editor}
		<StudentEditorModal account={target} handleClose={closeEditorModal} {handleRefresh} />
	{/if}
{/if}
{#if target}
	{#if modals.enroller}
		<StudentRecordAdderModal
			account={target}
			handleClose={closeEnrollerModal}
			{handleRefresh}
		/>
	{/if}
{/if}

<InteractiveTable
	bind:columns
	bind:sortItems
	bind:loading
	{...{ rowItems, tableTools, handleRefresh }}
/>
