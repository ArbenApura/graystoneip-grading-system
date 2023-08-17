<script lang="ts">
	// IMPORTED ASSETS
	import ClassesPNG from '$assets/storysets/Teacher-rafiki.png';
	// IMPORTED STATES
	import { isMD, isXL } from '$stores/mediaStates';
	import { isOpen } from '$stores/sidebarStates';
	import { account } from '$stores/authStates';
	// IMPORTED LIB-UTILS
	import { getProfessorCourseClassesCount } from '$utils/supabase';
</script>

<div class="flex flex-col gap-4 p-4 pt-0">
	<div
		class="grid grid-cols-1
        {$isOpen && $isMD ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} 
        {$isOpen && $isXL ? 'xl:grid-cols-2' : 'xl:grid-cols-4'}
        gap-4"
	>
		<a class="item" href="/app/classes/{$account.id}">
			<img src={ClassesPNG} alt="" />
			<div class="details">
				<p>
					{#await getProfessorCourseClassesCount($account.id)}
						...
					{:then count}
						{count}
					{:catch}
						?
					{/await}
				</p>
				<p>Classes</p>
			</div>
		</a>
	</div>
</div>

<style lang="scss">
	.item {
		@apply bg-white hover:bg-gray-200 rounded-md shadow-md text-right flex justify-between items-center;
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
