<script lang="ts">
	// IMPORTED TYPES
	import type { RowItem } from './types';
	// IMPORTED LIB-COMPONENTS
	import { Table } from '$lib';

	// PROPS
	export let sliced: RowItem[];
</script>

{#if sliced.every((rowItem) => rowItem.tools.length)}
	<Table.Head class="flex-center font-semibold">
		<i class="ph-bold ph-dots-three text-base" />
	</Table.Head>
{/if}
