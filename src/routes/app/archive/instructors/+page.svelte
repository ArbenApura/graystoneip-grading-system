<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	import type {
		Column,
		ColumnItem,
		RowItem,
		RowTool,
		SortItem,
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
	import { unarchiveAccount, selectAccounts } from '$utils/supabase';
	import { encrypt, decrypt } from '$utils';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';

	// PROPS
	export let data: any;

	// STATES
	let items: Account[] = [];
	let search = '';
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.archive.instructors_v2';

	// TABLE STATES
	let columns: Column[] = [
		{ name: 'id', label: 'ID No.', visible: true },
		{ name: 'last_name', label: 'Last Name', visible: true },
		{ name: 'first_name', label: 'First Name', visible: true },
		{ name: 'middle_name', label: 'Middle Name', visible: true },
		{ name: 'gender', label: 'Gender', visible: true },
		{ name: 'contact_number', label: 'Contact Nmber', visible: true },
		{ name: 'email', label: 'Email', visible: true },
		{ name: 'created_at', label: 'Created At', visible: true },
	];
	let sortItems: SortItem[] = [
		{ name: 'id', label: 'ID No.', type: 'none' },
		{ name: 'last_name', label: 'Last Name', type: 'asc' },
		{ name: 'email', label: 'Email', type: 'none' },
		{ name: 'created_at', label: 'Created At', type: 'none' },
	];
	$: rowItems = items.map((item) => {
		const columnItems: ColumnItem[] = [
			{ name: 'id', label: 'ID No.', value: item.id },
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
				label: 'Unarchive Instructor',
				icon: 'ph-bold ph-arrow-counter-clockwise',
				handleClick: () =>
					createConfirmationModal({
						message: 'Are you sure you want to unarchive this instructor account?',
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
			items = await selectAccounts({ type: 'instructor', search, is_archived: true });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};
	const handleUnarchive = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Unarchiving instructor account...' });
		try {
			await unarchiveAccount(id);
			await handleRefresh();
			createSuccessModal({ message: 'Instructor account was unarchived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.instructors) items = data.instructors;
		loadData();
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ti ti-archive', label: 'Archive', href: '' },
		{ label: 'Instructors', href: '/app/archive/instructors' },
	]}
/>

<InteractiveTable bind:columns bind:sortItems bind:loading {...{ rowItems, handleRefresh }} />
