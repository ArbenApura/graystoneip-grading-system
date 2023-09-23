<script lang="ts">
	// IMPORTED TYPES
	import type { RecoveryRequestData } from '$types/index';
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
		createInfoModal,
		createLoadingModal,
		createSuccessModal,
		removeModal,
	} from '$stores/modalStates';
	import { deleteRecoveryRequest, selectRecoveryRequests } from '$utils/supabase';
	import { encrypt, decrypt } from '$utils';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';

	// PROPS
	export let data: any;

	// STATES
	let items: RecoveryRequestData[] = [];
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.recovery-requests';

	// TABLE STATES
	let columns: Column[] = [
		{ name: 'source', label: 'Email / Student ID', visible: true },
		{ name: 'created_at', label: 'Created At', visible: true },
	];
	let sortItems: SortItem[] = [
		{ name: 'source', label: 'Email / Student ID', type: 'none' },
		{ name: 'created_at', label: 'Created At', type: 'none' },
	];
	$: rowItems = items.map((item) => {
		const columnItems: ColumnItem[] = [
			{
				name: 'source',
				label: 'Email / Student ID',
				value: item.recoveryRequest.source,
			},
			{
				name: 'created_at',
				label: 'Created At',
				value: new Date(item.recoveryRequest.created_at).toDateString(),
			},
		];
		const tools: RowTool[] = [
			{
				label: 'Send Credentials',
				icon: 'ph-bold ph-paper-plane-right',
				handleClick: () =>
					createInfoModal({
						message: `Please send the account information to the corresponding email address or contact number of the recovery request. [Email: ${item.account.email}, Contact Number: ${item.account.contact_number}, Password: ${item.account.password}]`,
					}),
			},
			{
				label: 'Delete Recovery Request',
				icon: 'ph-bold ph-trash',
				handleClick: () =>
					createConfirmationModal({
						message: 'Are you sure you want to delete this recovery request?',
						handleProceed: () => handleDelete(item.recoveryRequest.id),
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
			items = await selectRecoveryRequests({});
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};
	const handleDelete = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Deleting recovery request...' });
		try {
			await deleteRecoveryRequest(id);
			await handleRefresh();
			createSuccessModal({ message: 'Recover request was deleted successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.recoveryRequests) items = data.recoveryRequests;
		loadData();
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ph-bold ph-arrow-counter-clockwise', label: 'Recovery Requests', href: '' },
	]}
/>

<InteractiveTable bind:columns bind:sortItems bind:loading {...{ rowItems, handleRefresh }} />
