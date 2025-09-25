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
					{#if match.opponent}
						<p style="color: var(--text-2);">vs {match.opponent}</p>
					{/if}
				</div>
				<div style="text-align: right;">
					{#if match.result}
						<div style="font-size: 1.5rem; font-weight: 600; color: {match.isVictory ? 'var(--text)' : 'var(--text-3)'};">{match.result}</div>
					{/if}
					{#if match.score}
						<div style="color: var(--text-2);">{match.score}</div>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>
