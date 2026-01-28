import type { UrgencyLevel } from '../types';

/**
 * Maps integrity value (0-1) to color
 * 1.0 = Healthy (green)
 * 0.0 = Critical (red)
 */
export function getIntegrityColor(integrity: number): string {
    if (integrity >= 0.8) return '#22d3ee'; // cyan-400 (healthy)
    if (integrity >= 0.6) return '#06b6d4'; // cyan-500 (mild)
    if (integrity >= 0.3) return '#f59e0b'; // amber-500 (warning)
    return '#ef4444'; // red-500 (critical)
}

/**
 * Maps integrity value to CSS class name
 */
export function getIntegrityColorClass(integrity: number): string {
    if (integrity >= 0.8) return 'text-healthy';
    if (integrity >= 0.6) return 'text-healthy-dark';
    if (integrity >= 0.3) return 'text-warning';
    return 'text-critical';
}

/**
 * Maps RUL (Remaining Useful Life) in days to urgency level
 */
export function getUrgencyLevel(rulDays: number): UrgencyLevel {
    if (rulDays < 30) return 'critical';
    if (rulDays < 90) return 'high';
    if (rulDays < 180) return 'medium';
    return 'low';
}

/**
 * Maps urgency level to color
 */
export function getUrgencyColor(level: UrgencyLevel): string {
    switch (level) {
        case 'critical': return '#dc2626'; // red-600
        case 'high': return '#ef4444'; // red-500
        case 'medium': return '#f59e0b'; // amber-500
        case 'low': return '#22d3ee'; // cyan-400
    }
}

/**
 * Formats a number as percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats ISO date string to readable format
 */
export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Formats ISO date to short time format
 */
export function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
