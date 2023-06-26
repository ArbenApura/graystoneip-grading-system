<script lang="ts">
	// IMPORTED TYPES
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';

	// STATES
	const breadcrumbItems: BreadcrumbItem[] = [
		{ icon: 'ti ti-list-details', label: 'Curriculum', href: '' },
		{ label: 'Programs', href: '/app/curriculum/programs' },
	];
</script>

<Header {breadcrumbItems} />
