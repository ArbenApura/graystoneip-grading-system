<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED STATES
	import { isOpen } from '$stores/sidebarStates';
	import { isSMUp, isSMDown } from '$stores/mediaStates';
	import { account } from '$stores/authStates';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	// IMPORTED LIB-COMPONENTS
	import { Tooltip } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import AccountMenu from './AccountMenu.svelte';

	// TYPES
	type Item = {
		label: string;
		icon: string;
		location: string;
		params: string;
		contents: Item[];
		isOpen: boolean;
		isVisible: boolean;
	};

	// REFS
	let parentEl: HTMLDivElement;

	// STATES
	let items: Item[] = [
		{
			label: 'Dashboard',
			icon: 'ti ti-layout-dashboard',
			location: '/app/dashboard',
			params: '',
			isOpen: false,
			isVisible: true,
			contents: [],
		},
		{
			label: 'Classes',
			icon: 'ph-bold ph-chalkboard',
			location: '/app/classes',
			params: `?professor_id=${$account.id}`,
			isOpen: false,
			isVisible: $account.account_type === 'professor',
			contents: [],
		},
		{
			label: 'Master List',
			icon: 'ph-bold ph-user-list',
			location: '',
			params: '',
			isOpen: false,
			isVisible: $account.account_type === 'admin',
			contents: [
				{
					label: 'Professors',
					icon: 'ph-bold ph-chalkboard-teacher',
					location: '/app/master-list/professors',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
				{
					label: 'Students',
					icon: 'ph-bold ph-student',
					location: '/app/master-list/students',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
				{
					label: 'Enrollees',
					icon: 'ph-bold ph-user-list',
					location: '/app/master-list/enrollees',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
			],
		},
		{
			label: 'Curriculum',
			icon: 'ti ti-list-details',
			location: '',
			params: '',
			isOpen: false,
			isVisible: $account.account_type === 'admin',
			contents: [
				{
					label: 'Courses',
					icon: 'ti ti-books',
					location: '/app/curriculum/courses',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
				{
					label: 'Programs',
					icon: 'ti ti-school',
					location: '/app/curriculum/programs',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
			],
		},
		{
			label: 'Recovery Requests',
			icon: 'ph-bold ph-arrow-counter-clockwise',
			location: '/app/recovery-requests',
			params: '',
			isOpen: false,
			isVisible: $account.account_type === 'admin',
			contents: [],
		},
		{
			label: 'Admin Controls',
			icon: 'ti ti-shield-lock',
			location: '/app/admin-controls',
			params: '',
			isOpen: false,
			isVisible: $account.account_type === 'admin',
			contents: [],
		},
		{
			label: 'Archive',
			icon: 'ti ti-archive',
			location: '',
			params: '',
			isOpen: false,
			isVisible: $account.account_type === 'admin',
			contents: [
				{
					label: 'Professors',
					icon: 'ph-bold ph-chalkboard-teacher',
					location: '/app/archive/professors',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
				{
					label: 'Students',
					icon: 'ph-bold ph-student',
					location: '/app/archive/students',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
				{
					label: 'Enrollees',
					icon: 'ph-bold ph-user-list',
					location: '/app/archive/enrollees',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
				{
					label: 'Courses',
					icon: 'ti ti-books',
					location: '/app/archive/courses',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
				{
					label: 'Programs',
					icon: 'ti ti-school',
					location: '/app/archive/programs',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
				{
					label: 'Admins',
					icon: 'ti ti-shield-lock',
					location: '/app/archive/admins',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
			],
		},
		{
			label: 'Resources',
			icon: 'ph-bold ph-folders',
			location: '',
			params: '',
			isOpen: false,
			isVisible: true,
			contents: [
				{
					label: 'Privacy Policy',
					icon: 'ph-bold ph-lock-laminated',
					location: '/app/resources/privacy-policy',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
				{
					label: 'Terms and Conditions',
					icon: 'ph-bold ph-handshake',
					location: '/app/resources/terms-and-conditions',
					params: '',
					isOpen: false,
					isVisible: true,
					contents: [],
				},
			],
		},
	];
	let isAccountMenuOpen = false;

	// UTILS
	const handleClick = () => $isSMDown && isOpen.set(false);
	const setIsAccountMenuOpen = (isOpen: boolean) => (isAccountMenuOpen = isOpen);

	// LIFECYCLE
	onMount(() => {
		items = items.map((item) => {
			item.isOpen = item.contents.some((content) =>
				$page.url.pathname?.match(content.location),
			);
			return item;
		});
	});
</script>

{#if $isOpen || $isSMUp}
	<AccountMenu
		{...{ parentEl, isOpen: isAccountMenuOpen, setIsOpen: setIsAccountMenuOpen, handleClick }}
	/>
{/if}

{#if $isOpen && $isSMDown}
	<button
		class="fixed top-0 left-0 w-full h-screen bg-black opacity-25 z-30"
		on:click={handleClick}
	/>
{/if}

{#if $isOpen || (!$isOpen && $isSMUp)}
	<div
		class="sidebar fixed top-[60px] left-0 bg-white shadow-md w-full h-full flex flex-col z-30"
		data-is-detached={$isOpen && $isSMDown}
		data-is-minimized={!$isOpen && $isSMUp}
		data-is-maximized={$isOpen && $isSMUp}
	>
		<div class="h-full max-h-[calc(100%-120px)] overflow-y-auto">
			<div class="flex flex-col flex-grow">
				{#each items as item}
					{#if item.isVisible}
						{#if item.contents.length}
							<div class="w-full overflow-hidden">
								<div class="min-w-[300px] flex flex-col">
									<button
										class="flex items-center gap-4 cursor-pointer {item.isOpen
											? 'bg-slate-100'
											: 'hover:bg-slate-100'}"
										on:click={() => (item.isOpen = !item.isOpen)}
									>
										<div class="w-[60px] h-[60px] flex-center">
											<i
												class="{item.isOpen
													? 'ti ti-x'
													: item.icon} text-xl"
											/>
										</div>
										<p class="flex-grow">{item.label}</p>
										<div class="w-[60px] h-[60px] flex-center">
											<i
												class="ti ti-chevron-{item.isOpen
													? 'up'
													: 'down'} text-xl"
											/>
										</div>
									</button>
								</div>
							</div>
							{#if !$isOpen && $isSMUp}
								<Tooltip
									class="text-xs whitespace-nowrap"
									color="light"
									placement="right"
								>
									{item.label}
								</Tooltip>
							{/if}
							{#if item.isOpen}
								{#each item.contents as content}
									<div class="w-full overflow-hidden">
										<a
											class="min-w-[300px] flex items-center gap-4 cursor-pointer {$page.url.pathname?.match(
												content.location,
											)
												? 'bg-blue-600 text-white'
												: 'bg-gray-200 hover:bg-gray-300'}"
											href={content.location + content.params}
											on:click={handleClick}
										>
											<div class="w-[60px] h-[60px] flex-center">
												<i class="{content.icon} text-xl" />
											</div>
											<p>{content.label}</p>
										</a>
									</div>
									{#if !$isOpen && $isSMUp}
										<Tooltip
											class="text-xs whitespace-nowrap"
											color="light"
											placement="right"
										>
											{content.label}
										</Tooltip>
									{/if}
								{/each}
							{/if}
						{:else}
							<div class="w-full overflow-hidden">
								<a
									class="min-w-[300px] flex items-center gap-4 cursor-pointer {$page.url.pathname?.match(
										item.location,
									)
										? 'bg-blue-600 text-white'
										: 'hover:bg-gray-100'}"
									href={item.location + item.params}
									on:click={handleClick}
								>
									<div class="w-[60px] h-[60px] flex-center">
										<i class="{item.icon} text-xl" />
									</div>
									<p>{item.label}</p>
								</a>
							</div>
							{#if !$isOpen && $isSMUp}
								<Tooltip
									class="text-xs whitespace-nowrap"
									color="light"
									placement="right"
								>
									{item.label}
								</Tooltip>
							{/if}
						{/if}
					{/if}
				{/each}
			</div>
		</div>
		<div class="w-full overflow-hidden">
			<button
				class="min-w-[300px] flex items-center gap-4 cursor-pointer border-t
			{$page.url.pathname?.match('/app/account') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}"
				on:click={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
			>
				<div bind:this={parentEl} class="w-[60px] h-[60px] flex-center">
					<div
						class="rounded-full border-[2px] p-[2px] {$page.url.pathname?.match(
							'/app/account',
						)
							? 'border-white'
							: 'border-blue-600'}"
					>
						<div
							class="bg-gray-100 w-[35px] h-[35px] rounded-full bg-cover bg-center"
							style="background-image: url({$account.avatar || NoImagePNG})"
						/>
					</div>
				</div>
				<div class="flex-grow">
					<p class="text-[10px] leading-none capitalize">{$account.account_type}</p>
					<p class="text-ellipsis overflow-hidden whitespace-nowrap max-w-[140px]">
						{$account.full_name}
					</p>
				</div>
				<div class="w-[60px] h-[60px] flex-center">
					<i class="ti ti-dots" />
				</div>
			</button>
		</div>
		<Tooltip
			class="text-xs whitespace-nowrap"
			color="light"
			placement={$isOpen ? 'top' : 'right'}
		>
			More Options
		</Tooltip>
	</div>
{/if}

<style lang="scss">
	.sidebar {
		&[data-is-detached='true'] {
			max-width: 300px;
		}
		&[data-is-minimized='true'] {
			max-width: 60px;
		}
		&[data-is-maximized='true'] {
			max-width: 300px;
		}
	}
</style>
