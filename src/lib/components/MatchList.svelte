<script lang="ts">
	import type { MatchItem } from '$lib/types/components';

	export let matches: MatchItem[];
</script>

<div style="display: flex; flex-direction: column; gap: var(--gap-3);">
	{#each matches as match}
		<div class="card">
			<div style="display: flex; justify-content: space-between; align-items: center;">
				<div>
					<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: var(--gap-1);">{match.title}</h3>
					<p style="color: var(--text-2);">vs {match.opponent}</p>
				</div>
				<div style="text-align: right;">
					<div style="font-size: 1.5rem; font-weight: 600; color: {match.isVictory ? 'var(--text)' : 'var(--text-3)'};">{match.result}</div>
					<div style="color: var(--text-2);">{match.score}</div>
				</div>
			</div>
		</div>
	{/each}
</div>
