<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/elon.png';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	// IMPORTED STATES
	import { isOpen } from '$stores/sidebarStates';
	import { isSMUp, isSMDown } from '$stores/mediaStates';
	// IMPORTED LIB-COMPONENTS
	import { Tooltip, Avatar } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import AccountMenu from './AccountMenu.svelte';

	// TYPES
	type Item = {
		label: string;
		icon: string;
		location: string;
		contents: Item[];
		isOpen: boolean;
	};

	// REFS
	let parentEl: HTMLDivElement;

	// STATES
	let items: Item[] = [
		{
			label: 'Dashboard',
			icon: 'ti ti-layout-dashboard',
			location: '/app/dashboard',
			isOpen: false,
			contents: [],
		},
		{
			label: 'Master List',
			icon: 'ph-bold ph-user-list',
			location: '',
			isOpen: false,
			contents: [
				{
					label: 'Students',
					icon: 'ph-bold ph-student',
					location: '/app/master-list/students',
					isOpen: false,
					contents: [],
				},
				{
					label: 'Professors',
					icon: 'ph-bold ph-chalkboard-teacher',
					location: '/app/master-list/professors',
					isOpen: false,
					contents: [],
				},
			],
		},
		{
			label: 'Curriculum',
			icon: 'ti ti-list-details',
			location: '',
			isOpen: false,
			contents: [
				{
					label: 'Courses',
					icon: 'ti ti-books',
					location: '/app/curriculum/courses',
					isOpen: false,
					contents: [],
				},
				{
					label: 'Programs',
					icon: 'ti ti-school',
					location: '/app/curriculum/programs',
					isOpen: false,
					contents: [],
				},
			],
		},
		{
			label: 'Admin Controls',
			icon: 'ti ti-shield-lock',
			location: '/app/admin-controls',
			isOpen: false,
			contents: [],
		},
	];
	let isAccountMenuOpen = false;

	// UTILS
	const handleClick = () => $isSMDown && isOpen.set(false);
	const setIsAccountMenuOpen = (isOpen: boolean) => (isAccountMenuOpen = isOpen);

	// LIFECYCLE
	onMount(() => {
		items = items.map((item) => {
			item.isOpen = item.contents.some((content) => $page.route.id?.match(content.location));
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
	<button class="fixed top-0 left-0 w-full h-full bg-black opacity-25" on:click={handleClick} />
{/if}

{#if $isOpen || (!$isOpen && $isSMUp)}
	<div
		class="sidebar fixed top-[60px] left-0 bg-white shadow-md w-full h-full flex flex-col z-20"
		data-is-detached={$isOpen && $isSMDown}
		data-is-minimized={!$isOpen && $isSMUp}
		data-is-maximized={$isOpen && $isSMUp}
	>
		<div class="h-full max-h-[calc(100vh-120px)] overflow-y-auto">
			<div class="flex flex-col flex-grow">
				{#each items as item}
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
										<i class="{item.icon} text-xl" />
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
										class="min-w-[300px] flex items-center gap-4 cursor-pointer {$page.route.id?.match(
											content.location,
										)
											? 'bg-blue-600 text-white'
											: 'bg-gray-200 hover:bg-gray-300'}"
										href={content.location}
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
								class="min-w-[300px] flex items-center gap-4 cursor-pointer {$page.route.id?.match(
									item.location,
								)
									? 'bg-blue-600 text-white'
									: 'hover:bg-gray-100'}"
								href={item.location}
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
				{/each}
			</div>
		</div>
		<div class="w-full overflow-hidden">
			<button
				class="min-w-[300px] flex items-center gap-4 cursor-pointer border-t
			{$page.route.id?.match('/app/account') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}"
				on:click={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
			>
				<div class="w-[60px] h-[60px] flex-center" bind:this={parentEl}>
					<Avatar class="ring-blue-600" src={NoImagePNG} border />
				</div>
				<div class="flex-grow">
					<p class="text-[10px] leading-none">Admin</p>
					<p>Elon Musk</p>
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
