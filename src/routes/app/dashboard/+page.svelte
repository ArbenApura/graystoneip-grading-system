<script lang="ts">
	// IMPORTED TYPES
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import SummarySection from './components/SummarySection.svelte';

	// STATES
	const breadcrumbItems: BreadcrumbItem[] = [
		{ icon: 'ti ti-layout-dashboard', label: 'Dashboard', href: '/app/dashboard' },
	];
</script>

<Header {breadcrumbItems} />

<div class="flex flex-col gap-4 p-4 pt-0">
	<SummarySection />
</div>
