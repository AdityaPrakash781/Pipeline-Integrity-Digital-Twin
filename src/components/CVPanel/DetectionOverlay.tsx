import type { CVOutput } from '../../types';

interface DetectionOverlayProps {
    cvData: CVOutput;
}

/**
 * SVG overlay showing detected corrosion regions as polygon masks
 */
export default function DetectionOverlay({ cvData }: DetectionOverlayProps) {
    // Convert normalized coordinates to SVG viewBox coordinates
    const polygonPoints = cvData.polygon_mask
        .map(([x, y]) => `${x * 200},${y * 200}`)
        .join(' ');

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 200"
            preserveAspectRatio="xMidYMid slice"
        >
            {/* Detected corrosion region */}
            <polygon
                points={polygonPoints}
                fill="rgba(239, 68, 68, 0.3)"
                stroke="#ef4444"
                strokeWidth="2"
                className="animate-pulse-slow"
            />

            {/* Confidence indicator */}
            <text
                x="10"
                y="30"
                fill="#22d3ee"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
            >
                CONF: {(cvData.confidence * 100).toFixed(0)}%
            </text>

            {/* Corrosion percentage */}
            <text
                x="10"
                y="42"
                fill="#ef4444"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
            >
                CORR: {cvData.corrosion_surface_pct.toFixed(1)}%
            </text>
        </svg>
    );
}
