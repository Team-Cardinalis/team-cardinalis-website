<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import LoadingIndicator from './LoadingIndicator.svelte';

	let { 
		title, 
		description = '', 
		isSubmitting = false, 
		submitText = 'Submit', 
		cancelText = 'Cancel', 
		cancelUrl = '/dashboard', 
		error = '', 
		success = '',
		children 
	} = $props();

	const dispatch = createEventDispatcher<{
		submit: void;
		cancel: void;
	}>();

	function handleSubmit(): void {
		if (!isSubmitting) {
			dispatch('submit');
		}
	}

	function handleCancel(): void {
		dispatch('cancel');
	}
</script>

<div class="card" style="max-width: 600px;">
	<div style="margin-bottom: var(--gap-5);">
		<h1 style="font-size: 2rem; font-weight: 700; margin-bottom: var(--gap-2);">
			{title}
		</h1>
		{#if description}
			<p style="color: var(--text-2); font-size: 18px;">
				{description}
			</p>
		{/if}
	</div>

	<form onsubmit={handleSubmit}>
		{@render children()}

		{#if error}
			<div class="message-error">
				{error}
			</div>
		{/if}

		{#if success}
			<div class="message-success">
				{success}
			</div>
		{/if}

		<div style="display: flex; justify-content: space-between; gap: var(--gap-3); margin-top: var(--gap-5);">
			<a href={cancelUrl} class="btn-secondary btn-small">
				{cancelText}
			</a>
			<button
				type="submit"
				disabled={isSubmitting}
				class="btn-primary"
			>
				{#if isSubmitting}
					<LoadingIndicator isLoading={true} size="small" />
					Submitting...
				{:else}
					{submitText}
				{/if}
			</button>
		</div>
	</form>
</div>
