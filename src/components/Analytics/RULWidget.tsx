import { getUrgencyLevel, getUrgencyColor } from '../../utils/colors';

interface RULWidgetProps {
    rul: number; // Remaining Useful Life in days
}

/**
 * Remaining Useful Life widget with color-coded urgency
 */
export default function RULWidget({ rul }: RULWidgetProps) {
    const urgency = getUrgencyLevel(rul);
    const color = getUrgencyColor(urgency);

    const urgencyLabels = {
        low: 'Normal',
        medium: 'Monitor',
        high: 'Attention Required',
        critical: 'CRITICAL'
    };

    return (
        <div
            className="rounded-lg p-6 relative overflow-hidden"
            style={{
                backgroundColor: `${color}15`,
                borderLeft: `4px solid ${color}`
            }}
        >
            <div className="relative z-10">
                <div className="text-sm text-slate-400 mb-2">Remaining Useful Life</div>

                <div className="flex items-baseline gap-3 mb-3">
                    <div
                        className="text-5xl font-bold"
                        style={{ color }}
                    >
                        {rul}
                    </div>
                    <div className="text-2xl text-slate-400">days</div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <span
                        className="status-badge text-xs"
                        style={{
                            backgroundColor: `${color}30`,
                            color: color
                        }}
                    >
                        {urgencyLabels[urgency]}
                    </span>
                </div>

                <div className="text-xs text-slate-400 italic">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Calculated using Fick's 2nd Law diffusion model with observed corrosion rates
                </div>
            </div>

            {/* Background decoration */}
            <div
                className="absolute right-0 top-0 w-32 h-32 opacity-5"
                style={{ color }}
            >
                <svg viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 10 L90 90 L10 90 Z" />
                </svg>
            </div>
        </div>
    );
}
