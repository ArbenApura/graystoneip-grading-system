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

<div class="bg-white rounded-md shadow-md w-full p-4 flex flex-col gap-4">
	<div class="flex items-center justify-between gap-4">
		<div class="flex gap-4 items-center">
			<Badge class="aspect-square p-2">
				<i class="ti ti-report-analytics text-[18px]" />
			</Badge>
			<p class="text-sm whitespace-nowrap">New Entries</p>
		</div>
		<Select
			class="max-w-[150px]"
			placeholder="Choose time span..."
			items={timeSpans}
			value="month"
		/>
	</div>
	<hr />
	<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
		<a class="item bg-blue-500 hover:bg-blue-600" href="/app/master-list/professors">
			<Badge class="aspect-square p-2">
				<i class="ph-bold ph-chalkboard-teacher text-[18px]" />
			</Badge>
			<div class="details">
				<p>New Professors</p>
				<p>+ 12</p>
			</div>
		</a>
		<a class="item bg-red-500 hover:bg-red-600" href="/app/master-list/students">
			<Badge class="aspect-square p-2" color="red">
				<i class="ph-bold ph-student text-[18px]" />
			</Badge>
			<div class="details">
				<p>New Students</p>
				<p>+ 100</p>
			</div>
		</a>
		<a class="item bg-yellow-300 hover:bg-yellow-400" href="/app/curriculum/courses">
			<Badge class="aspect-square p-2" color="yellow">
				<i class="ti ti-books text-[18px]" />
			</Badge>
			<div class="details">
				<p>New Courses</p>
				<p>+ 30</p>
			</div>
		</a>
		<a class="item bg-green-500 hover:bg-green-600" href="/app/curriculum/programs">
			<Badge class="aspect-square p-2" color="green">
				<i class="ti ti-school text-[18px]" />
			</Badge>
			<div class="details">
				<p>New Programs</p>
				<p>+ 10</p>
			</div>
		</a>
	</div>
</div>

<style lang="scss">
	.item {
		@apply text-white rounded-md p-4 flex items-center gap-4;
		.details {
			p {
				@apply leading-none;
			}
			p:first-child {
				@apply text-xs;
			}
			p:last-child {
				@apply text-sm;
			}
		}
	}
</style>
