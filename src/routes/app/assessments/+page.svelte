<script lang="ts">
	// IMPORTED TYPES
	import type { CriteriaGradeData, CriteriaItemData } from '$types/index';
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
	import { createErrorModal } from '$stores/modalStates';
	import { selectAssessmentsByStudentId, selectCriteriaGrades } from '$utils/supabase';
	import { encrypt, decrypt } from '$utils';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';

	// PROPS
	export let data;

	// STATES
	let criteria_grades = data.criteria_grades;
	let items: CriteriaItemData[] = [];
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.assessments_v1';

	// TABLE STATES
	let columns: Column[] = [
		{ name: 'class_name', label: 'Class Name', visible: true },
		{ name: 'instructor', label: 'Instructor', visible: true },
		{ name: 'name', label: 'Name', visible: true },
		{ name: 'score', label: 'Score', visible: true },
		{ name: 'total', label: 'Total', visible: true },
		{ name: 'status', label: 'Status', visible: true },
		{ name: 'created_at', label: 'Created At', visible: true },
	];
	let sortItems: SortItem[] = [
		{ name: 'class_name', label: 'Class Name', type: 'none' },
		{ name: 'instructor', label: 'Instructor', type: 'none' },
		{ name: 'name', label: 'Name', type: 'none' },
		{ name: 'score', label: 'Score', type: 'none' },
		{ name: 'total', label: 'Total', type: 'none' },
		{ name: 'status', label: 'Status', type: 'none' },
		{ name: 'created_at', label: 'Created At', type: 'asc' },
	];
	let filterGroups: FilterGroup[] = [
		{
			name: 'status',
			label: 'Status',
			items: [
				{ label: 'Completed', match: 'Completed', active: true },
				{ label: 'Open', match: 'Open', active: true },
				{ label: 'Closed', match: 'Closed', active: true },
			],
		},
	];
	$: rowItems = items.map((item) => {
		let score = '?';
		for (let criteria_grade of criteria_grades) {
			if (
				criteria_grade.criteria_item_id === item.id &&
				criteria_grade.course_student.student_record.account_id === data.student.id
			) {
				score = criteria_grade.score.toString();
				break;
			}
		}
		const columnItems: ColumnItem[] = [
			{ name: 'class_name', label: 'Class Name', value: item.criteria.course_class.name },
			{
				name: 'instructor',
				label: 'Instructor',
				value: item.criteria.course_class.instructor.full_name,
			},
			{ name: 'name', label: 'Name', value: item.name },
			{
				name: 'score',
				label: 'Score',
				value: item.is_score_released ? score : 'Not Yet Released',
			},
			{ name: 'total', label: 'Total', value: item.total.toString() },
			{
				name: 'status',
				label: 'Status',
				value: score !== '?' ? 'Completed' : item.is_open ? 'Open' : 'Closed',
			},
			{
				name: 'created_at',
				label: 'Created At',
				value: new Date(item.created_at).toDateString(),
			},
		];
		const tools: RowTool[] = [];
		if (item.is_open && score === '?') {
			tools.push({
				label: 'Take Assessment',
				icon: 'ph-bold ph-pen',
				href:
					'/app/assessments/assessment?student_id=' +
					data.student.id +
					'&assessment_id=' +
					item.id,
			});
		}
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
			items = await selectAssessmentsByStudentId(data.student.id);
			let __criteria_grades: CriteriaGradeData[] = [];
			await Promise.all(
				items.map(async (assessment) => {
					let _criteria_grades = await selectCriteriaGrades({
						course_class_id: assessment.criteria.course_class_id,
					});
					__criteria_grades = [...__criteria_grades, ..._criteria_grades];
				}),
			);
			criteria_grades = __criteria_grades;
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
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
			icon: 'ph-bold ph-list-checks',
			label: 'Assessments',
			href: '',
		},
		{
			label: $page.data.student.full_name,
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
