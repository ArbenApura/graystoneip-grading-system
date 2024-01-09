<script lang="ts">
	// IMPORTED TYPES
	import type { CriteriaItemData } from '$types/index';
	import type {
		Column,
		ColumnItem,
		FilterGroup,
		RowItem,
		RowTool,
		SortItem,
	} from '$components/modules/InteractiveTable';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	// IMPORTED UTILS
	import {
		createConfirmationModal,
		createErrorModal,
		createLoadingModal,
		createSuccessModal,
		removeModal,
	} from '$stores/modalStates';
	import {
		closeAssessment,
		deleteCriteriaItem,
		openAssessment,
		selectAssessments,
	} from '$utils/supabase';
	import { encrypt, decrypt } from '$utils';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';

	// PROPS
	export let data;

	// STATES
	let items: CriteriaItemData[] = [];
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.classes.class.assessments_v1';

	// TABLE STATES
	let columns: Column[] = [
		{ name: 'criteria', label: 'Criteria', visible: true },
		{ name: 'name', label: 'Name', visible: true },
		{ name: 'total', label: 'Total', visible: true },
		{ name: 'status', label: 'Status', visible: true },
		{ name: 'created_at', label: 'Created At', visible: true },
	];
	let sortItems: SortItem[] = [
		{ name: 'criteria', label: 'Criteria', type: 'none' },
		{ name: 'name', label: 'Name', type: 'none' },
		{ name: 'total', label: 'Total', type: 'none' },
		{ name: 'status', label: 'Status', type: 'none' },
		{ name: 'created_at', label: 'Created At', type: 'asc' },
	];
	let filterGroups: FilterGroup[] = [
		{
			name: 'status',
			label: 'Status',
			items: [
				{ label: 'Open', match: 'Open', active: true },
				{ label: 'Closed', match: 'Closed', active: true },
			],
		},
	];
	$: rowItems = items.map((item) => {
		const columnItems: ColumnItem[] = [
			{ name: 'criteria', label: 'Criteria', value: item.criteria.name },
			{ name: 'name', label: 'Name', value: item.name },
			{ name: 'total', label: 'Total', value: item.total.toString() },
			{ name: 'status', label: 'Status', value: item.is_open ? 'Open' : 'Closed' },
			{
				name: 'created_at',
				label: 'Created At',
				value: new Date(item.created_at).toDateString(),
			},
		];
		const tools: RowTool[] = [
			{
				label: 'Edit Assessment',
				icon: 'ph-bold ph-pen',
				href:
					'/app/classes/class/assessments/assessment/?instructor_id=' +
					$page.data.instructor.id +
					'&course_class_id=' +
					$page.data.courseClass.id +
					'&assessment_id=' +
					item.id,
			},
			item.is_open
				? {
						label: 'Close Assessment',
						icon: 'ph-bold ph-pause',
						handleClick: () =>
							createConfirmationModal({
								message: 'Are you sure you want to close this assessment?',
								handleProceed: () => handleClose(item.id),
							}),
				  }
				: {
						label: 'Open Assessment',
						icon: 'ph-bold ph-play',
						handleClick: () =>
							createConfirmationModal({
								message: 'Are you sure you want to open this assessment?',
								handleProceed: () => handleOpen(item.id),
							}),
				  },
			{
				label: 'Delete Assessment',
				icon: 'ph-bold ph-trash',
				handleClick: () =>
					createConfirmationModal({
						message: 'Are you sure you want to delete this assessment?',
						handleProceed: () => handleDelete(item.id),
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

	// UTILS
	const handleRefresh = async () => {
		loading = true;
		try {
			items = await selectAssessments(data.courseClass.id);
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		loading = false;
	};
	const handleOpen = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Opening assessment...' });
		try {
			await openAssessment(id);
			await handleRefresh();
			createSuccessModal({ message: 'Assessment was opened successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};
	const handleClose = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Closing assessment...' });
		try {
			await closeAssessment(id);
			await handleRefresh();
			createSuccessModal({ message: 'Assessment was closed successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};
	const handleDelete = async (id: string) => {
		loading = true;
		const modalId = createLoadingModal({ message: 'Deleting assessment...' });
		try {
			await deleteCriteriaItem(id);
			await handleRefresh();
			createSuccessModal({ message: 'Assessment was deleted successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		removeModal(modalId);
		loading = false;
	};

	// LIFECYCLES
	onMount(() => {
		if (data.assessments) items = data.assessments;
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
			label: 'Assessments',
			href: $page.url.pathname + $page.url.search,
		},
	]}
/>

<InteractiveTable
	bind:columns
	bind:sortItems
	bind:filterGroups
	bind:loading
	{...{ rowItems, handleRefresh }}
/>
