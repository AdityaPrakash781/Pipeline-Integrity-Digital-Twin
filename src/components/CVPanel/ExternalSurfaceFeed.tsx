import { useEffect, useRef } from 'react';

/**
 * External Surface Inspection Feed
 * Renders a rich animated SVG/CSS pipe cross-section focusing on
 * external wall surface corrosion, coating breakdown, and laser scan overlay.
 */
export default function ExternalSurfaceFeed({ segmentId }: { segmentId: string }) {
    const isCorroded =
        segmentId.includes('3') ||
        segmentId.includes('7') ||
        segmentId.includes('1') ||
        segmentId.includes('5');

    const scanLineRef = useRef<SVGLineElement>(null);
    const scanFrameRef = useRef<number>(0);
    const startRef = useRef<number | null>(null);

    useEffect(() => {
        const totalWidth = 480;
        const animate = (timestamp: number) => {
            if (!startRef.current) startRef.current = timestamp;
            const elapsed = (timestamp - startRef.current) % 3200;
            const x = (elapsed / 3200) * totalWidth;
            if (scanLineRef.current) {
                scanLineRef.current.setAttribute('x1', String(x));
                scanLineRef.current.setAttribute('x2', String(x));
            }
            scanFrameRef.current = requestAnimationFrame(animate);
        };
        scanFrameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(scanFrameRef.current);
    }, []);

    return (
        <div
            className="relative overflow-hidden select-none"
            style={{ width: '100%', height: '100%', background: '#050505' }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 480 200"
                preserveAspectRatio="xMidYMid meet"
                style={{ display: 'block' }}
            >
                <defs>
                    {/* Metallic steel pipe body gradient — light steel blue */}
                    <linearGradient id="pipeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="18%" stopColor="#cbd5e1" />
                        <stop offset="38%" stopColor="#e2e8f0" />
                        <stop offset="55%" stopColor="#94a3b8" />
                        <stop offset="75%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#334155" />
                    </linearGradient>

                    {/* Pipe end flange gradient */}
                    <linearGradient id="flangeGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="50%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#475569" />
                    </linearGradient>

                    {/* Corrosion red-amber radial heatmap */}
                    <radialGradient id="corrGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
                    </radialGradient>

                    {/* Minor rust stain gradient */}
                    <radialGradient id="rustGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#92400e" stopOpacity="0" />
                    </radialGradient>

                    {/* Laser scan glow gradient */}
                    <linearGradient id="laserGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c8ccd2" stopOpacity="0" />
                        <stop offset="30%" stopColor="#c8ccd2" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#e2e8f0" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#c8ccd2" stopOpacity="0" />
                    </linearGradient>

                    {/* Reference grid clip to keep it inside the pipe */}
                    <clipPath id="pipeClip">
                        <rect x="30" y="38" width="420" height="124" rx="2" />
                    </clipPath>
                </defs>

                {/* === Background === */}
                <rect width="480" height="200" fill="#050505" />

                {/* Reference grid lines clipped to pipe interior */}
                <g clipPath="url(#pipeClip)" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="0.5">
                    {[80, 160, 240, 320, 400].map(x => (
                        <line key={`vg-${x}`} x1={x} y1="38" x2={x} y2="162" />
                    ))}
                    {[75, 100, 125, 138].map(y => (
                        <line key={`hg-${y}`} x1="30" y1={y} x2="450" y2={y} />
                    ))}
                </g>

                {/* === Main Pipe Body === */}
                <rect x="30" y="38" width="420" height="124" rx="2" fill="url(#pipeGrad)" />

                {/* Top specular highlight strip */}
                <rect x="30" y="38" width="420" height="14" rx="2" fill="white" fillOpacity="0.12" />

                {/* Bottom shadow strip */}
                <rect x="30" y="148" width="420" height="14" rx="2" fill="black" fillOpacity="0.4" />

                {/* Longitudinal weld seam */}
                <line x1="30" y1="100" x2="450" y2="100" stroke="#475569" strokeWidth="2.5" strokeDasharray="12 5" />

                {/* === Left Flange Ring === */}
                <rect x="8" y="30" width="28" height="140" rx="3" fill="url(#flangeGrad)" />
                <rect x="8" y="30" width="4" height="140" rx="2" fill="white" fillOpacity="0.2" />
                {/* Bolt holes */}
                {[50, 80, 120, 150].map(y => (
                    <circle key={`lb-${y}`} cx="22" cy={y} r="4" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                ))}

                {/* === Right Flange Ring === */}
                <rect x="444" y="30" width="28" height="140" rx="3" fill="url(#flangeGrad)" />
                <rect x="468" y="30" width="4" height="140" rx="2" fill="white" fillOpacity="0.2" />
                {[50, 80, 120, 150].map(y => (
                    <circle key={`rb-${y}`} cx="458" cy={y} r="4" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                ))}

                {/* Pipe end caps / bore hole */}
                <ellipse cx="30" cy="100" rx="4" ry="62" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <ellipse cx="450" cy="100" rx="4" ry="62" fill="#0f172a" stroke="#334155" strokeWidth="1" />

                {/* === External Corrosion Damage Zones === */}
                {isCorroded && (
                    <>
                        {/* Primary corrosion hot-spot */}
                        <ellipse cx="190" cy="55" rx="48" ry="22" fill="url(#corrGrad)" />
                        {/* Bounding damage box with dashed outline */}
                        <rect
                            x="140" y="38" width="100" height="44"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="1.2"
                            strokeDasharray="5 3"
                        />
                        {/* Corner tick marks */}
                        <line x1="140" y1="38" x2="150" y2="38" stroke="#ef4444" strokeWidth="1.5" />
                        <line x1="140" y1="38" x2="140" y2="48" stroke="#ef4444" strokeWidth="1.5" />
                        <line x1="240" y1="38" x2="230" y2="38" stroke="#ef4444" strokeWidth="1.5" />
                        <line x1="240" y1="38" x2="240" y2="48" stroke="#ef4444" strokeWidth="1.5" />
                        <line x1="140" y1="82" x2="150" y2="82" stroke="#ef4444" strokeWidth="1.5" />
                        <line x1="140" y1="82" x2="140" y2="72" stroke="#ef4444" strokeWidth="1.5" />
                        <line x1="240" y1="82" x2="230" y2="82" stroke="#ef4444" strokeWidth="1.5" />
                        <line x1="240" y1="82" x2="240" y2="72" stroke="#ef4444" strokeWidth="1.5" />
                        {/* Defect label */}
                        <text x="143" y="35" fill="#ef4444" fontSize="7" fontFamily="monospace" fontWeight="bold">
                            EXT_DEFECT_A [CORROSION]
                        </text>

                        {/* Secondary rust stain */}
                        <ellipse cx="330" cy="148" rx="36" ry="14" fill="url(#rustGrad)" />
                        <rect
                            x="292" y="135" width="76" height="27"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="0.8"
                            strokeDasharray="4 3"
                            strokeOpacity="0.8"
                        />
                        <text x="296" y="131" fill="#f59e0b" fontSize="6.5" fontFamily="monospace">
                            EXT_DEFECT_B [COATING]
                        </text>
                    </>
                )}

                {/* Healthy scan marks */}
                {!isCorroded && (
                    <text x="180" y="107" fill="#a1a1aa" fontSize="9" fontFamily="monospace" fillOpacity="0.6">
                        ✓ NO EXTERNAL DEFECTS DETECTED
                    </text>
                )}

                {/* === Animated Laser Scanner Line === */}
                <line
                    ref={scanLineRef}
                    x1="30" y1="30" x2="30" y2="170"
                    stroke="url(#laserGrad)"
                    strokeWidth="2.5"
                />
                {/* Glow bloom around scanner */}
                <line
                    ref={undefined}
                    x1="30" y1="30" x2="30" y2="170"
                    stroke="#c8ccd2"
                    strokeWidth="6"
                    strokeOpacity="0.12"
                />
            </svg>

            {/* HUD overlays */}
            <div className="absolute top-2 left-3 flex items-center gap-2 bg-black/80 border border-industrial-700/80 px-2.5 py-1 rounded text-[10px] pointer-events-none z-10">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-zinc-200 font-semibold tracking-wider">EXTERNAL OPTICAL SCAN</span>
                <span className="text-zinc-500 font-mono">| CAM-OUT-01</span>
            </div>

            <div className="absolute bottom-2 left-3 bg-black/80 border border-industrial-700/80 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 pointer-events-none z-10">
                SEG: <span className="text-white font-bold">{segmentId}</span>
                <span className="text-zinc-600 ml-1">· OUTER WALL</span>
            </div>

            <div className="absolute bottom-2 right-3 bg-black/80 border border-industrial-700/80 px-2 py-0.5 rounded text-[10px] font-mono pointer-events-none z-10">
                COATING:{' '}
                {isCorroded ? (
                    <span className="text-amber-400 font-bold">DEGRADED</span>
                ) : (
                    <span className="text-zinc-300 font-bold">INTACT</span>
                )}
            </div>
        </div>
    );
}
