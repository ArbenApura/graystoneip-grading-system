<script lang="ts">
	// IMPORTED TYPES
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';

	// STATES
	const breadcrumbItems: BreadcrumbItem[] = [
		{ icon: 'ph-bold ph-user-list', label: 'Master List', href: '' },
		{ label: 'Students', href: '/app/master-list/students' },
	];
</script>

<Header {breadcrumbItems} />
