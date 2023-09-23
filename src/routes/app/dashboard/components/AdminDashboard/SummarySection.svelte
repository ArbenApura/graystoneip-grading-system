<script lang="ts">
	// IMPORTED ASSETS
	import ProgessorsPNG from '$assets/storysets/Mathematics-rafiki.png';
	import StudentsPNG from '$assets/storysets/Learning-cuate.png';
	import CoursesPNG from '$assets/storysets/Learning-rafiki.png';
	import ProgramsPNG from '$assets/storysets/Learning-bro.png';
	// IMPORTED STATES
	import { isMD, isXL } from '$stores/mediaStates';
	import { isOpen } from '$stores/sidebarStates';
	// IMPORTED UTILS
	import {
		getCoursesCount,
		getInstructorsCount,
		getProgramsCount,
		getStudentsCount,
	} from '$utils/supabase';
</script>

<div
	class="grid grid-cols-1
        {$isOpen && $isMD ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} 
        {$isOpen && $isXL ? 'xl:grid-cols-2' : 'xl:grid-cols-4'}
        gap-4"
>
	<a class="item" href="/app/master-list/instructors">
		<img src={ProgessorsPNG} alt="" />
		<div class="details">
			<p>
				{#await getInstructorsCount()}
					...
				{:then count}
					{count}
				{:catch}
					?
				{/await}
			</p>
			<p>Instructors</p>
		</div>
	</a>
	<a class="item" href="/app/master-list/students">
		<img src={StudentsPNG} alt="" />
		<div class="details">
			<p>
				{#await getStudentsCount()}
					...
				{:then count}
					{count}
				{:catch}
					?
				{/await}
			</p>
			<p>Students</p>
		</div>
	</a>
	<a class="item" href="/app/curriculum/courses">
		<img src={CoursesPNG} alt="" />
		<div class="details">
			<p>
				{#await getCoursesCount()}
					...
				{:then count}
					{count}
				{:catch}
					?
				{/await}
			</p>
			<p>Courses</p>
		</div>
	</a>
	<a class="item" href="/app/curriculum/programs">
		<img src={ProgramsPNG} alt="" />
		<div class="details">
			<p>
				{#await getProgramsCount()}
					...
				{:then count}
					{count}
				{:catch}
					?
				{/await}
			</p>
			<p>Programs</p>
		</div>
	</a>
</div>

<style lang="scss">
	.item {
		@apply bg-white hover:bg-gray-200 rounded-md shadow-md text-right flex justify-between items-center p-2;
		img {
			@apply w-[50%] min-w-[50%] aspect-square;
		}
		.details {
			@apply p-8;
			P:first-child {
				@apply text-3xl;
			}
		}
	}
</style>
