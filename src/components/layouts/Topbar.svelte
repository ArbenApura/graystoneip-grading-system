<script lang="ts">
	// IMPORTED ASSETS
	import LogoPNG from '$assets/images/logo.png';
	// IMPORTED COMPONENTS
	import { Button } from 'flowbite-svelte';
	// IMPORTED UTILS
	import { toggleSidebar } from '$stores/sidebarStates';
	import { createConfirmationModal } from '$stores/modalStates';
	import { account, logout } from '$stores/authStates';
	// IMPORTED STATES
	import { isSMUp } from '$stores/mediaStates';
	import { isOpen } from '$stores/sidebarStates';

	// REACTIVE STATES
	$: href =
		$account.account_type === 'student'
			? '/app/grades?student_id=' + $account.id
			: $account.account_type === 'professor'
			? '/app/classes?professor_id=' + $account.id
			: '/app/dashboard';

	// UTILS
	const handleLogout = () =>
		createConfirmationModal({
			message: 'Are you sure you want to logout?',
			handleProceed: logout,
		});
</script>

<div class="bg-white shadow-md fixed top-0 left-0 w-full h-[60px] flex items-center z-40">
	<div class="box-center">
		<Button pill={true} outline={true} class="!p-2" size="xl" on:click={toggleSidebar}>
			<i class={`ti ti-${$isOpen ? 'x' : 'menu-2'}`} />
		</Button>
	</div>
	<a class="h-[60px] flex items-center gap-2 flex-grow" {href}>
		<img class=" rounded-full shadow-md w-[36px] h-[36px]" src={LogoPNG} alt="" />
		<p class="text-xs sm:text-sm">Graystone Institute of the Philippines</p>
	</a>
	{#if $isSMUp}
		<div class="h-[60px] p-4 flex items-center gap-4">
			<Button class="flex-center gap-2" color="light" size="xs" href="/app/account">
				<i class="ph-bold ph-user" />
				<small class="capitalize">{$account.account_type}</small>
			</Button>
			<span class="text-gray-300">|</span>
			<Button class="flex-center gap-2" size="xs" on:click={handleLogout}>
				<i class="ti ti-logout" />
				<small>Logout</small>
			</Button>
		</div>
	{/if}
</div>

<style lang="scss">
	.box-center {
		@apply w-[60px] h-[60px] flex items-center justify-center;
	}
</style>
