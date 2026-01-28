interface ConfidenceMeterProps {
    confidence: number; // 0-1
}

/**
 * Circular confidence meter with color gradient
 */
export default function ConfidenceMeter({ confidence }: ConfidenceMeterProps) {
    const percentage = confidence * 100;
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (percentage / 100) * circumference;

    // Color based on confidence
    const getColor = () => {
        if (confidence >= 0.8) return '#22d3ee'; // cyan (high)
        if (confidence >= 0.6) return '#f59e0b'; // amber (medium)
        return '#ef4444'; // red (low)
    };

    const color = getColor();

    return (
        <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx="48"
                    cy="48"
                    r="45"
                    stroke="#334155"
                    strokeWidth="8"
                    fill="none"
                />

                {/* Progress circle */}
                <circle
                    cx="48"
                    cy="48"
                    r="45"
                    stroke={color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                />
            </svg>

            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="text-2xl font-bold"
                        style={{ color }}
                    >
                        {percentage.toFixed(0)}
                    </div>
                    <div className="text-xs text-slate-400">%</div>
                </div>
            </div>
        </div>
    );
}
