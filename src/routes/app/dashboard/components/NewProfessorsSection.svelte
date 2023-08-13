<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED TYPES
	import type { Account } from '$types/credentials';
	// IMPORTED STATES
	import { isMD, isLG, isXL } from '$stores/mediaStates';
	import { isOpen } from '$stores/sidebarStates';
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	// IMPORTED UTILS
	import { createErrorModal } from '$stores/modalStates';
	import { selectNewProfessors } from '$utils/supabase';
	// IMPORTED LIB-COMPONENTS
	import { Badge, Select, Avatar } from 'flowbite-svelte';

	// STATES
	let span = 'week';
	let professors: Account[] = $page.data.newProfessorsWeek || [];
	let isLoading = false;

	// UTILS
	const handleChange = async () => {
		isLoading = true;
		try {
			professors = await selectNewProfessors(span);
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
</script>

<div class="bg-white rounded-md shadow-md p-4 flex flex-col gap-4 h-full">
	<div class="flex items-center justify-between gap-4">
		<div class="flex gap-4 items-center">
			<Badge class="aspect-square p-2">
				<i class="ph-bold ph-chalkboard-teacher text-[18px]" />
			</Badge>
			<p class="text-sm whitespace-nowrap">New Professors</p>
		</div>
		<Select
			bind:value={span}
			on:change={handleChange}
			class="max-w-[150px]"
			placeholder="Choose time span..."
			items={[
				{ name: 'This week', value: 'week' },
				{ name: 'This month', value: 'month' },
				{ name: 'This year', value: 'year' },
			]}
			disabled={isLoading}
		/>
	</div>
	<hr />
	<div
		class="grid grid-cols-1 sm:grid-cols-2
            {$isOpen && $isMD ? 'md:grid-cols-2' : 'md:grid-cols-3'} 
            {$isOpen && ($isLG || $isXL) ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} 
            gap-4"
	>
		{#each professors as professor}
			<div class="text-center flex flex-col items-center px-4 py-8 border rounded-md">
				<div class="rounded-full border-[2px] p-[2px] border-blue-600 mb-4">
					<div
						class="bg-gray-100 w-[100px] h-[100px] rounded-full bg-cover bg-center"
						style="background-image: url({professor.avatar || NoImagePNG})"
					/>
				</div>
				<p class="text-sm">{professor.full_name}</p>
				<p class="text-[10px]">Joined on {new Date(professor.created_at).toDateString()}</p>
			</div>
		{/each}
	</div>
</div>
