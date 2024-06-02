<script lang="ts">
	// IMPORTED TYPES
	import type { CourseStudentData } from '$types/index';
	import type {
		Column,
		ColumnItem,
		RowItem,
		SortItem,
		FilterGroup,
	} from '$components/modules/InteractiveTable';
	// IMPORTED LIB-STORES
	import { page } from '$app/stores';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// IMPORTED UTILS
	import {
		createErrorModal,
		createLoadingModal,
		createSuccessModal,
		removeModal,
	} from '$stores/modalStates';
	import { unarchiveStudentRecord, selectCourseStudents } from '$utils/supabase';
	import { encrypt, decrypt } from '$utils';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import InteractiveTable from '$components/modules/InteractiveTable/InteractiveTable.svelte';

	// PROPS
	export let data: any;

	// STATES
	let items: CourseStudentData[] = [];
	let search = '';
	let loading = false;
	let initialized = false;
	let localStorageKey = 'config.grades_v2';

	// TABLE STATES
	let columns: Column[] = [
		{ name: 'thumbnail', label: 'Thumbnail', visible: true },
		{ name: 'name', label: 'Class Name', visible: true },
		{ name: 'instructor', label: 'Instructor', visible: true },
		{ name: 'instructor_avatar', label: 'Instructor Avatar', visible: true },
		{ name: 'course_code', label: 'Course Code', visible: true },
		{ name: 'course_description', label: 'Course Description', visible: true },
		{ name: 'grade', label: 'Grade', visible: true },
		{ name: 'semester', label: 'Semester', visible: true },
		{ name: 'school_year', label: 'School Year', visible: true },
	];
	let sortItems: SortItem[] = [
		{ name: 'name', label: 'Class Name', type: 'asc' },
		{ name: 'instructor', label: 'Instructor', type: 'none' },
		{ name: 'course_code', label: 'Course Code', type: 'none' },
		{ name: 'grade', label: 'Grade', type: 'none' },
		{ name: 'semester', label: 'Semester', type: 'none' },
		{ name: 'school_year', label: 'School Year', type: 'none' },
	];
	let filterGroups: FilterGroup[] = [
		{
			label: 'Semester',
			name: 'semester',
			items: [
				{ label: '1st', match: '1st', active: true },
				{ label: '2nd', match: '2nd', active: true },
			],
		},
		{
			label: 'School Year',
			name: 'school_year',
			items: [
				{ label: '2023-2024', match: '2023-2024', active: true },
				{ label: '2024-2025', match: '2024-2025', active: true },
				{ label: '2025-2026', match: '2025-2026', active: true },
				{ label: '2026-2027', match: '2026-2027', active: true },
				{ label: '2027-2028', match: '2027-2028', active: true },
			],
		},
	];
	$: rowItems = items.map((item) => {
		const columnItems: ColumnItem[] = [
			{ name: 'thumbnail', label: 'Thumbnail', value: item.course_class.thumbnail },
			{ name: 'name', label: 'Class Name', value: item.course_class.name },
			{
				name: 'instructor',
				label: 'Instructor',
				value: item.course_class.instructor.full_name,
			},
			{
				name: 'instructor_avatar',
				label: 'Instructor Avatar',
				value: item.course_class.instructor.avatar,
			},
			{ name: 'course_code', label: 'Course Code', value: item.course_class.course.code },
			{
				name: 'course_description',
				label: 'Course Description',
				value: item.course_class.course.description,
			},
			{
				name: 'grade',
				label: 'Grade',
				value: item.is_grade_released ? item.grade : 'Not Yet Released',
			},
			{ name: 'semester', label: 'Semester', value: item.semester },
			{ name: 'school_year', label: 'School Year', value: item.school_year },
		];
		return { columnItems, tools: [] } as RowItem;
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
			items = await selectCourseStudents({
				search,
				student_id: $page.data.student.id,
			});
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
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
			icon: 'ph-bold ph-exam',
			label: 'Grades',
			href: '',
		},
		{
			label: $page.data.student.full_name,
			href: '/app/grades?student_id=' + $page.data.student.id,
		},
	]}
/>

<InteractiveTable
	bind:columns
	bind:sortItems
	bind:filterGroups
	bind:loading
	type="thumbnail"
	{...{ rowItems, handleRefresh }}
/>
