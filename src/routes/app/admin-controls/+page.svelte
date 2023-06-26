<script lang="ts">
	// IMPORTED TYPES
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';

	// STATES
	const breadcrumbItems: BreadcrumbItem[] = [
		{
			icon: 'ti ti-shield-lock',
			label: 'Admin Controls',
			href: '/app/admin-controls',
		},
	];
</script>

<Header {breadcrumbItems} />
