<script lang="ts">
	// IMPORTED ASSETS
	import StudentsPNG from '$assets/storysets/Students-rafiki.png';
	import GradesPNG from '$assets/storysets/Grades-bro.png';
	import AttendancePNG from '$assets/storysets/Date picker-pana.png';
	// IMPORTED STATES
	import { isMD, isXL } from '$stores/mediaStates';
	import { isOpen } from '$stores/sidebarStates';
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	// IMPORTED UTILS
	import { getCourseClassStudentsCount } from '$utils/supabase';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
</script>

<Header
	breadcrumbItems={[
		{
			icon: 'ph-bold ph-chalkboard',
			label: 'Classes',
			href: '/app/classes?professor_id=' + $page.data.professor.id,
		},
		{
			label: $page.data.professor.full_name,
			href: '/app/classes?professor_id=' + $page.data.professor.id,
		},
		{
			label: $page.data.courseClass.name,
			href: $page.url.pathname + $page.url.search,
		},
	]}
/>

<div class="flex flex-col gap-4 p-4 pt-0">
	<div
		class="grid grid-cols-1
        {$isOpen && $isMD ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} 
        {$isOpen && $isXL ? 'xl:grid-cols-2' : 'xl:grid-cols-4'}
        gap-4"
	>
		<a class="item" href="{$page.url.pathname}/students{$page.url.search}">
			<img src={StudentsPNG} alt="" />
			<div class="p-8">
				<p class="text-3xl">
					{#await getCourseClassStudentsCount($page.data.courseClass.id)}
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
		<a class="item" href="{$page.url.pathname}/grades{$page.url.search}">
			<img src={GradesPNG} alt="" />
			<div class="p-8">
				<p>Grades</p>
			</div>
		</a>
		<a class="item" href="{$page.url.pathname}/attendance{$page.url.search}">
			<img src={AttendancePNG} alt="" />
			<div class="p-8">
				<p>Attendance</p>
			</div>
		</a>
	</div>
</div>

<style lang="scss">
	.item {
		@apply bg-white hover:bg-gray-200 rounded-md shadow-md text-right flex justify-between items-center p-2;
		img {
			@apply w-[50%] min-w-[50%] aspect-square;
		}
	}
</style>
