<script lang="ts">
	import { onMount } from 'svelte';
	import { errorStore, ErrorType, useErrorService, type AppError } from '$lib/services/errorService';
	import { DateFormatters, UIHelpers } from '$lib/utils/commonUtils';
	import LoadingIndicator from './LoadingIndicator.svelte';

	export let showErrors: boolean = true;
	export let maxErrors: number = 5;
	export let autoHide: boolean = true;
	export let hideDelay: number = 5000;

	const errorService = useErrorService();
	let errors: AppError[] = [];
	let isVisible = false;

	// S'abonner aux changements d'erreurs
	$: {
		errorStore.subscribe((errorList: AppError[]) => {
			errors = errorList.slice(0, maxErrors);
			isVisible = errors.length > 0 && showErrors;
		});
	}

	onMount(() => {
		// Nettoyer les erreurs anciennes au montage
		errorService.clearOldErrors();

		// Auto-hide errors if enabled
		if (autoHide && errors.length > 0) {
			const timer = setTimeout(() => {
				isVisible = false;
			}, hideDelay);

			return () => clearTimeout(timer);
		}
	});

	function dismissError(index: number): void {
		errorService.removeError(index);
	}

	function dismissAllErrors(): void {
		errorService.clearErrors();
		isVisible = false;
	}
</script>

{#if isVisible && errors.length > 0}
	<div class="error-container" style="position: fixed; top: 80px; right: var(--gap-4); z-index: 10000; max-width: 400px;">
		<div class="error-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-2);">
			<h3 style="margin: 0; font-size: 16px; color: var(--text);">
				Erreurs ({errors.length})
			</h3>
			<button
				on:click={dismissAllErrors}
				class="btn-secondary btn-small"
				style="padding: 4px 8px; font-size: 12px;"
				title="Fermer toutes les erreurs"
			>
				✕
			</button>
		</div>

		<div class="error-list" style="display: flex; flex-direction: column; gap: var(--gap-2);">
			{#each errors as error, index (error.timestamp)}
				<div 
					class="error-item" 
					style="
						background: var(--surface-elevated); 
						border: 1px solid {UIHelpers.getErrorColor(error.type)}; 
						border-radius: var(--r-sm); 
						padding: var(--gap-3); 
						animation: slideIn 0.3s ease-out;
					"
				>
					<div style="display: flex; align-items: flex-start; gap: var(--gap-2);">
						<div style="font-size: 18px; margin-top: 2px;">
							{UIHelpers.getErrorIcon(error.type)}
						</div>
						
						<div style="flex: 1; min-width: 0;">
							<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--gap-1);">
								<h4 style="margin: 0; font-size: 14px; font-weight: 600; color: var(--text);">
									{error.message}
								</h4>
								<button
									on:click={() => dismissError(index)}
									style="
										background: none; 
										border: none; 
										color: var(--text-3); 
										cursor: pointer; 
										padding: 2px; 
										font-size: 12px;
										transition: color 0.2s ease;
									"
									on:mouseenter={(e) => {
										const target = e.target as HTMLElement;
										if (target) target.style.color = 'var(--text)';
									}}
									on:mouseleave={(e) => {
										const target = e.target as HTMLElement;
										if (target) target.style.color = 'var(--text-3)';
									}}
									title="Fermer cette erreur"
								>
									✕
								</button>
							</div>
							
							<div style="font-size: 12px; color: var(--text-3); margin-bottom: var(--gap-1);">
								{DateFormatters.formatRelativeTime(error.timestamp)}
								{#if error.code}
									• {error.code}
								{/if}
							</div>
							
							{#if error.details && import.meta.env.DEV}
								<details style="margin-top: var(--gap-1);">
									<summary style="cursor: pointer; font-size: 12px; color: var(--text-2);">
										Technical details
									</summary>
									<pre style="
										background: var(--surface); 
										padding: var(--gap-2); 
										border-radius: var(--r-sm); 
										font-size: 11px; 
										color: var(--text-3); 
										margin: var(--gap-1) 0 0 0; 
										overflow-x: auto;
									">
										{JSON.stringify(error.details, null, 2)}
									</pre>
								</details>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.error-container {
		backdrop-filter: blur(10px);
		background: rgba(10, 10, 10, 0.9);
		border: 1px solid var(--divider);
		border-radius: var(--r-sm);
		padding: var(--gap-3);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.error-item {
		transition: all 0.2s ease;
	}

	.error-item:hover {
		background: var(--surface) !important;
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
	}

	@media (max-width: 768px) {
		.error-container {
			position: fixed;
			top: 60px;
			left: var(--gap-3);
			right: var(--gap-3);
			max-width: none;
		}
	}
</style>
