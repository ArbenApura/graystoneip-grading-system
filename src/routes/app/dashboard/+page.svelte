<script lang="ts">
	// IMPORTED TYPES
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import AdminDashboard from './components/AdminDashboard';

	// STATES
	const breadcrumbItems: BreadcrumbItem[] = [
		{ icon: 'ti ti-layout-dashboard', label: 'Dashboard', href: '/app/dashboard' },
	];
</script>

<Header {breadcrumbItems} />

<AdminDashboard />
