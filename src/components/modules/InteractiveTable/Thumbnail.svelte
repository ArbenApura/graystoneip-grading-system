<script lang="ts">
	// IMPORTED ASSETS
	import DefaultThumbnailPNG from '$assets/images/default-thumbnail.png';
	import NoImagePNG from '$assets/images/no-image.png';
	import TableToolBody from './TableToolBody.svelte';
	// IMPORTED TYPES
	import type { RowItem } from './types';

	// -- REQUIRED PROPS -- //

	export let rowItem: RowItem;
	export let loading: boolean;

	// -- STATES -- //

	let thumbnail = DefaultThumbnailPNG;
	let course = '';
	let className = '';
	let instructor = '';
	let instructorAvatar = NoImagePNG;
	let schoolYear = '';
	let semester = '';
	let grade = '';

	// -- REACTIVE STATEMENTS -- //

	$: rowItem.columnItems.forEach((item) => {
		if (item.name === 'thumbnail' && item.value) thumbnail = item.value;
		if (item.name === 'course' && item.value) course = item.value;
		if (item.name === 'name' && item.value) className = item.value;
		if (item.name === 'instructor' && item.value) instructor = item.value;
		if (item.name === 'instructor_avatar' && item.value) instructorAvatar = item.value;
		if (item.name === 'school_year' && item.value) schoolYear = item.value;
		if (item.name === 'semester' && item.value) semester = item.value;
		if (item.name === 'grade' && item.value) grade = item.value;
	});
</script>

<div class="bg-white border rounded-md shadow-md relative">
	<a href={rowItem.href}>
		<div class="{rowItem.href ? 'hover:bg-accent' : ''} w-full">
			<!-- THUMBNAIL -->
			<div
				class="h-[200px] w-full bg-center bg-cover"
				style="background-image: url({thumbnail})"
			/>

			<!-- INSTRUCTOR AVATAR -->
			<div
				class="bg-center bg-cover absolute top-[160px] right-4 w-20 h-20 rounded-full border-2 border-white"
				style="background-image: url({instructorAvatar})"
			/>

			<!-- BODY -->
			<div class="p-4 flex flex-col">
				<small>{course}</small>
				<h4>{className}</h4>
				<p>{instructor}</p>
				<small>{schoolYear} | {semester} Semester</small>
				{#if grade}
					<small>Grade: {grade}</small>
				{/if}
			</div>
		</div>
	</a>

	<hr />

	{#if rowItem.tools.length}
		<!-- FOOTER -->
		<div class="flex-end-center">
			<TableToolBody bind:loading {rowItem} />
		</div>
	{/if}
</div>
