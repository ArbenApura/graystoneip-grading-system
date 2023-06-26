<script lang="ts">
	// IMPORTED TYPES
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';

	// STATES
	const breadcrumbItems: BreadcrumbItem[] = [
		{ icon: 'ph-bold ph-user', label: 'Account', href: '/app/account' },
	];
</script>

<Header {breadcrumbItems} />
