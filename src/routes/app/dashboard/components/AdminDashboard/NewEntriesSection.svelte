<script lang="ts">
	// IMPORTED LIB-COMPONENTS
	import { Badge, Select } from 'flowbite-svelte';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// IMPORTED UTILS
	import { createErrorModal } from '$stores/modalStates';
	import {
		getCoursesCount,
		getInstructorsCount,
		getProgramsCount,
		getStudentsCount,
	} from '$utils/supabase';

	// STATES
	let span = 'week';
	let instructors: any = '...';
	let students: any = '...';
	let courses: any = '...';
	let programs: any = '...';
	let isLoading = false;

	// UTILS
	const handleChange = async () => {
		isLoading = true;
		try {
			await Promise.all([
				(instructors = await getInstructorsCount(span)),
				(students = await getStudentsCount(span)),
				(courses = await getCoursesCount(span)),
				(programs = await getProgramsCount(span)),
			]);
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};

	// LIFECYCLES
	onMount(handleChange);
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
	<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
		<a class="item bg-blue-500 hover:bg-blue-600" href="/app/master-list/instructors">
			<Badge class="aspect-square p-2">
				<i class="ph-bold ph-chalkboard-teacher text-[18px]" />
			</Badge>
			<div class="details">
				<p>New Instructors</p>
				<p>+ {instructors}</p>
			</div>
		</a>
		<a class="item bg-red-500 hover:bg-red-600" href="/app/master-list/students">
			<Badge class="aspect-square p-2" color="red">
				<i class="ph-bold ph-student text-[18px]" />
			</Badge>
			<div class="details">
				<p>New Students</p>
				<p>+ {students}</p>
			</div>
		</a>
		<a class="item bg-yellow-300 hover:bg-yellow-400" href="/app/courses">
			<Badge class="aspect-square p-2" color="yellow">
				<i class="ti ti-books text-[18px]" />
			</Badge>
			<div class="details">
				<p>New Courses</p>
				<p>+ {courses}</p>
			</div>
		</a>
		<a class="item bg-green-500 hover:bg-green-600" href="/app/programs">
			<Badge class="aspect-square p-2" color="green">
				<i class="ti ti-school text-[18px]" />
			</Badge>
			<div class="details">
				<p>New Programs</p>
				<p>+ {programs}</p>
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
