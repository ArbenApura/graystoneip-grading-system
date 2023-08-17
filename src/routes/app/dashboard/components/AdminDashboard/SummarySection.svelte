<script lang="ts">
	// IMPORTED ASSETS
	import ProgessorsPNG from '$assets/storysets/Mathematics-rafiki.png';
	import StudentsPNG from '$assets/storysets/Learning-cuate.png';
	import CoursesPNG from '$assets/storysets/Learning-rafiki.png';
	import ProgramsPNG from '$assets/storysets/Learning-bro.png';
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	// IMPORTED STATES
	import { isMD, isXL } from '$stores/mediaStates';
	import { isOpen } from '$stores/sidebarStates';
</script>

<div
	class="grid grid-cols-1
        {$isOpen && $isMD ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} 
        {$isOpen && $isXL ? 'xl:grid-cols-2' : 'xl:grid-cols-4'}
        gap-4"
>
	<a class="item" href="/app/master-list/professors">
		<img src={ProgessorsPNG} alt="" />
		<div class="details">
			<p>{$page.data.professorsCount || 0}</p>
			<p>Professors</p>
		</div>
	</a>
	<a class="item" href="/app/master-list/students">
		<img src={StudentsPNG} alt="" />
		<div class="details">
			<p>{$page.data.studentsCount || 0}</p>
			<p>Students</p>
		</div>
	</a>
	<a class="item" href="/app/curriculum/courses">
		<img src={CoursesPNG} alt="" />
		<div class="details">
			<p>{$page.data.coursesCount || 0}</p>
			<p>Courses</p>
		</div>
	</a>
	<a class="item" href="/app/curriculum/programs">
		<img src={ProgramsPNG} alt="" />
		<div class="details">
			<p>{$page.data.programsCount || 0}</p>
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
