export function formatDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function getTimeRemaining(endDate: number): string {
	const now = Date.now();
	const remaining = endDate - now;
	
	if (remaining <= 0) return 'Ended';
	
	const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
	const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
	
	if (days > 0) return `${days}d ${hours}h`;
	if (hours > 0) return `${hours}h ${minutes}m`;
	return `${minutes}m`;
}
