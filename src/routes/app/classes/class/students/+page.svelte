<script lang="ts">
	// IMPORTED UTILS
	import { page } from '$app/stores';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';

	$: console.log($page.data);
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
			href:
				'/app/classes/class?professor_id=' +
				$page.data.professor.id +
				'&course_class_id=' +
				$page.data.courseClass.id,
		},
		{
			label: 'Students',
			href: $page.url.pathname + $page.url.search,
		},
	]}
/>
