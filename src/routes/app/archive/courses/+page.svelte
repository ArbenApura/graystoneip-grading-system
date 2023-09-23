<script lang="ts">
	// IMPORTED TYPES
	import type { Course } from '$types/index';
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
		removeModal,
	} from '$stores/modalStates';
	import { unarchiveCourse, selectCourses } from '$utils/supabase';
	import { encrypt, decrypt } from '$utils';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';

	// PROPS
	export let data: any;

	// STATES
	let items: Course[] = [];
	let search = '';
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.archive.courses';

	// TABLE STATES
	let columns: Column[] = [
		{ name: 'code', label: 'Code', visible: true },
		{ name: 'description', label: 'Description', visible: true },
		{ name: 'units', label: 'Units', visible: true },
		{ name: 'hours', label: 'Hours', visible: true },
		{ name: 'created_at', label: 'Created At', visible: true },
	];
	let sortItems: SortItem[] = [
		{ name: 'code', label: 'Code', type: 'asc' },
		{ name: 'description', label: 'Description', type: 'none' },
		{ name: 'units', label: 'Units', type: 'none' },
		{ name: 'hours', label: 'Hours', type: 'none' },
		{ name: 'created_at', label: 'Created At', type: 'none' },
	];
	$: rowItems = items.map((item) => {
		const columnItems: ColumnItem[] = [
			{ name: 'code', label: 'Code', value: item.code },
			{ name: 'description', label: 'Description', value: item.description },
			{ name: 'units', label: 'Units', value: item.units.toString() },
			{ name: 'hours', label: 'Hours', value: item.hours.toString() },
			{
				name: 'created_at',
				label: 'Created At',
				value: new Date(item.created_at).toDateString(),
			},
		];
		const tools: RowTool[] = [
			{
				label: 'Unarchive Course',
				icon: 'ph-bold ph-arrow-counter-clockwise',
				handleClick: () =>
					createConfirmationModal({
						message: 'Are you sure you want to unarchive this course?',
						handleProceed: () => handleUnarchive(item.id),
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
			items = await selectCourses({ search, is_archived: true });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};
	const handleUnarchive = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Unarchiving course...' });
		try {
			await unarchiveCourse(id);
			await handleRefresh();
			createSuccessModal({ message: 'Course was unarchived successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.courses) items = data.courses;
		loadData();
	});
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ti ti-archive', label: 'Archive', href: '' },
		{ label: 'Courses', href: '/app/archive/courses' },
	]}
/>

<InteractiveTable bind:columns bind:sortItems bind:loading {...{ rowItems, handleRefresh }} />
