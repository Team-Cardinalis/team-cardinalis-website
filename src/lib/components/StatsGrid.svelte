<script lang="ts">
	import type { StatItem } from '$lib/types/components';

	export let stats: StatItem[];
</script>

<div class="grid grid-4">
	{#each stats as stat}
		<div class="card" style="text-align: center;">
			<div style="font-size: 2.5rem; font-weight: 700; color: var(--text); margin-bottom: var(--gap-1);">{stat.value}</div>
			<div style="color: var(--text-2);">{stat.label}</div>
		</div>
	{/each}
</div>
