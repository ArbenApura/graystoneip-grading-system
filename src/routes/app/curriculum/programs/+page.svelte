<script lang="ts">
	// IMPORTED TYPES
	import type { Program } from '$types/index';
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
	import { archiveProgram, selectPrograms } from '$utils/supabase';
	import { generateId, encrypt, decrypt } from '$utils';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import ProgramAdderModal from './components/ProgramAdderModal.svelte';
	import ProgramEditorModal from './components/ProgramEditorModal.svelte';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';

	// PROPS
	export let data: any;

	// MODAL STATES
	let modalId = generateId();
	let modals = { adder: false, editor: false };
	let target: Program | null = null;

	// MODAL UTILS
	const openAdderModal = () => {
		modals.adder = true;
		createCustomModal(modalId);
	};
	const closeAdderModal = () => {
		modals.adder = false;
		removeCustomModal(modalId);
	};
	const openEditorModal = (program: Program) => {
		createCustomModal(modalId);
		modals.editor = true;
		target = program;
	};
	const closeEditorModal = () => {
		modals.editor = false;
		removeCustomModal(modalId);
	};

	// STATES
	let items: Program[] = [];
	let search = '';
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.curriculum.programs';

	// TABLE STATES
	let columns: Column[] = [
		{ name: 'code', label: 'Code', visible: true },
		{ name: 'description', label: 'Description', visible: true },
		{ name: 'created_at', label: 'Created At', visible: true },
	];
	let sortItems: SortItem[] = [
		{ name: 'code', label: 'Code', type: 'asc' },
		{ name: 'description', label: 'Description', type: 'none' },
		{ name: 'created_at', label: 'Created At', type: 'none' },
	];
	$: rowItems = items.map((item) => {
		const columnItems: ColumnItem[] = [
			{ name: 'code', label: 'Code', value: item.code },
			{ name: 'description', label: 'Description', value: item.description },
			{
				name: 'created_at',
				label: 'Created At',
				value: new Date(item.created_at).toDateString(),
			},
		];
		const tools: RowTool[] = [
			{
				label: 'Edit Program',
				icon: 'ph-bold ph-pen',
				handleClick: () => openEditorModal(item),
			},
			{
				label: 'Archive Program',
				icon: 'ph-bold ph-archive',
				handleClick: () =>
					createConfirmationModal({
						message: 'Are you sure you want to archive this program?',
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

	// UTILS
	const handleRefresh = async () => {
		loading = true;
		try {
			items = await selectPrograms({ search });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};
	const handleArchive = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Archiving program...' });
		try {
			await archiveProgram(id);
			await handleRefresh();
			createSuccessModal({ message: 'Program was archived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.programs) items = data.programs;
		loadData();
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ti ti-list-details', label: 'Curriculum', href: '' },
		{ label: 'Programs', href: '/app/curriculum/programs' },
	]}
/>

{#if modals.adder}
	<ProgramAdderModal handleClose={closeAdderModal} {handleRefresh} />
{/if}
{#if target}
	{#if modals.editor}
		<ProgramEditorModal program={target} handleClose={closeEditorModal} {handleRefresh} />
	{/if}
{/if}

<InteractiveTable
	bind:columns
	bind:sortItems
	bind:tableTools
	bind:loading
	{...{ rowItems, handleRefresh }}
/>
