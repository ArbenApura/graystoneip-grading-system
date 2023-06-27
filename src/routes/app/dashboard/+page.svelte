<script lang="ts">
	// IMPORTED TYPES
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import SummarySection from './components/SummarySection.svelte';
	import NewProfessorsSection from './components/NewProfessorsSection.svelte';
	import NewEntriesSection from './components/NewEntriesSection.svelte';

	// STATES
	const breadcrumbItems: BreadcrumbItem[] = [
		{ icon: 'ti ti-layout-dashboard', label: 'Dashboard', href: '/app/dashboard' },
	];
</script>

<Header {breadcrumbItems} />

<div class="flex flex-col gap-4 p-4 pt-0">
	<SummarySection />
	<div class="grid grid-cols-1 xl:grid-cols-6 gap-4">
		<div class="col-span-1 xl:col-span-4">
			<NewProfessorsSection />
		</div>
		<div class="col-span-1 xl:col-span-2 flex items-stretch">
			<NewEntriesSection />
		</div>
	</div>
</div>
