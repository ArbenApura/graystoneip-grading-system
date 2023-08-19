<script lang="ts">
	// IMPORTED TYPES
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED STATES
	import { account } from '$stores/authStates';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import AdminDashboard from './components/AdminDashboard';
	import ProfessorDashboard from './components/ProfessorDashboard.svelte';
	import StudentDashboard from './components/StudentDashboard.svelte';

	// STATES
	const breadcrumbItems: BreadcrumbItem[] = [
		{ icon: 'ti ti-layout-dashboard', label: 'Dashboard', href: '/app/dashboard' },
	];
</script>

<Header {breadcrumbItems} />

{#if $account.account_type === 'admin'}
	<AdminDashboard />
{:else if $account.account_type === 'professor'}
	<ProfessorDashboard />
{:else if $account.account_type === 'student'}
	<StudentDashboard />
{/if}
