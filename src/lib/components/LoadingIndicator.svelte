<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isLoading: boolean = false;
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let message: string = '';
	export let showMessage: boolean = false;

	const dispatch = createEventDispatcher<{
		loaded: void;
	}>();

	// Calculate size once to avoid recalculations
	$: sizePx = size === 'small' ? '12px' : size === 'large' ? '32px' : '24px';
	
	// Dispatch event when loading ends
	$: if (!isLoading) {
		dispatch('loaded');
	}
</script>

{#if isLoading}
	<div class="loading-container" style="display: flex; flex-direction: column; align-items: center; gap: var(--gap-2);">
		<div 
			class="loading-spinner" 
			style="width: {sizePx}; height: {sizePx}; background: var(--text-2); border-radius: 50%; animation: pulse 1.5s ease-in-out infinite;"
		></div>
		{#if showMessage && message}
			<p class="loading-message" style="color: var(--text-2); font-size: 14px; margin: 0;">
				{message}
			</p>
		{/if}
	</div>
{/if}

<style>
	@keyframes pulse {
		0%, 100% {
			opacity: 0.4;
		}
		50% {
			opacity: 1;
		}
	}
	
	.loading-container {
		min-height: 40px;
		justify-content: center;
	}
</style>
