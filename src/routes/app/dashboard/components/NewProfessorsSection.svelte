<script lang="ts">
	// IMPORTED STATES
	import { isMD, isLG, isXL } from '$stores/mediaStates';
	import { isOpen } from '$stores/sidebarStates';
	// IMPORTED LIB-COMPONENTS
	import { Badge, Select, Avatar } from 'flowbite-svelte';

	// STATES
	const timeSpans = [
		{ name: 'This week', value: 'week' },
		{ name: 'This month', value: 'month' },
		{ name: 'This year', value: 'year' },
	];
</script>

<div class="bg-white rounded-md shadow-md p-4 flex flex-col gap-4">
	<div class="flex items-center justify-between gap-4">
		<div class="flex gap-4 items-center">
			<Badge class="aspect-square p-2">
				<i class="ph-bold ph-chalkboard-teacher text-[18px]" />
			</Badge>
			<p class="text-sm whitespace-nowrap">New Professors</p>
		</div>
		<Select
			class="max-w-[150px]"
			placeholder="Choose time span..."
			items={timeSpans}
			value="month"
		/>
	</div>
	<hr />
	<div
		class="grid grid-cols-1 sm:grid-cols-2
            md:{$isOpen && $isMD ? 'grid-cols-2' : 'grid-cols-3'} 
            lg:{$isOpen && ($isLG || $isXL) ? 'grid-cols-3' : 'grid-cols-4'} 
            gap-4"
	>
		<div class="text-center flex flex-col items-center px-4 py-8 border rounded-md">
			<Avatar class="ring-blue-600 mb-2" src="" size="lg" border />
			<p class="text-sm">Elon Musk</p>
			<p class="text-[10px]">Joined on June 27, 2023</p>
		</div>
		<div class="text-center flex flex-col items-center px-4 py-8 border rounded-md">
			<Avatar class="ring-blue-600 mb-2" src="" size="lg" border />
			<p class="text-sm">Elon Musk</p>
			<p class="text-[10px]">Joined on June 27, 2023</p>
		</div>
		<div class="text-center flex flex-col items-center px-4 py-8 border rounded-md">
			<Avatar class="ring-blue-600 mb-2" src="" size="lg" border />
			<p class="text-sm">Elon Musk</p>
			<p class="text-[10px]">Joined on June 27, 2023</p>
		</div>
		<div class="text-center flex flex-col items-center px-4 py-8 border rounded-md">
			<Avatar class="ring-blue-600 mb-2" src="" size="lg" border />
			<p class="text-sm">Elon Musk</p>
			<p class="text-[10px]">Joined on June 27, 2023</p>
		</div>
		<div class="text-center flex flex-col items-center px-4 py-8 border rounded-md">
			<Avatar class="ring-blue-600 mb-2" src="" size="lg" border />
			<p class="text-sm">Elon Musk</p>
			<p class="text-[10px]">Joined on June 27, 2023</p>
		</div>
		<div class="text-center flex flex-col items-center px-4 py-8 border rounded-md">
			<Avatar class="ring-blue-600 mb-2" src="" size="lg" border />
			<p class="text-sm">Elon Musk</p>
			<p class="text-[10px]">Joined on June 27, 2023</p>
		</div>
		<div class="text-center flex flex-col items-center px-4 py-8 border rounded-md">
			<Avatar class="ring-blue-600 mb-2" src="" size="lg" border />
			<p class="text-sm">Elon Musk</p>
			<p class="text-[10px]">Joined on June 27, 2023</p>
		</div>
		<div class="text-center flex flex-col items-center px-4 py-8 border rounded-md">
			<Avatar class="ring-blue-600 mb-2" src="" size="lg" border />
			<p class="text-sm">Elon Musk</p>
			<p class="text-[10px]">Joined on June 27, 2023</p>
		</div>
	</div>
</div>
