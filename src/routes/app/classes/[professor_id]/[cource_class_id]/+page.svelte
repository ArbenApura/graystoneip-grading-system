<script lang="ts">
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
</script>

<Header
	breadcrumbItems={[
		{
			icon: 'ph-bold ph-chalkboard',
			label: 'Classes',
			href: '/app/classes/' + $page.params.professor_id,
		},
		{ label: $page.data.courseClass.name, href: '' },
	]}
/>
