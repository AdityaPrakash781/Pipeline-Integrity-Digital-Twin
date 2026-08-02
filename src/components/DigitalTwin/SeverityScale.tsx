import { usePipelineStore } from '../../store/usePipelineStore';
import { formatPercentage, getIntegrityColor } from '../../utils/colors';

/**
 * Severity scale legend component displaying pipeline integrity levels,
 * color gradient mapping, and interactive segment selection indicators.
 */
export default function SeverityScale() {
    const segments = usePipelineStore((state) => state.segments);
    const selectedSegmentId = usePipelineStore((state) => state.selectedSegmentId);
    const selectSegment = usePipelineStore((state) => state.selectSegment);

    const selectedSegment = selectedSegmentId ? segments.get(selectedSegmentId) : null;
    const selectedIntegrity = selectedSegment ? selectedSegment.integrity : null;
    const indicatorPosPct = selectedIntegrity !== null ? Math.round(selectedIntegrity * 100) : null;

    const severityCategories = [
        { label: 'Critical', range: '< 30%', color: '#ef4444' },
        { label: 'Warning', range: '30% - 60%', color: '#f59e0b' },
        { label: 'Mild', range: '60% - 80%', color: '#10b981' },
        { label: 'Healthy', range: '80% - 100%', color: '#3b82f6' },
    ];

    return (
        <div className="w-full bg-industrial-950 border-t border-industrial-700/80 px-4 py-3 text-zinc-200 select-none">
            {/* Header & Status Indicator */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                        Pipeline Severity & Integrity Scale
                    </span>
                </div>

                {selectedSegment ? (
                    <div className="flex items-center gap-2 bg-industrial-850 border border-industrial-700 rounded px-2 py-0.5 text-xs">
                        <span className="text-zinc-400">Selected:</span>
                        <span className="font-mono font-semibold text-white">{selectedSegment.segment_id}</span>
                        <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: getIntegrityColor(selectedSegment.integrity) }}
                        ></span>
                        <span className="font-medium text-zinc-200">{formatPercentage(selectedSegment.integrity)}</span>
                        <button
                            onClick={() => selectSegment(null)}
                            className="ml-1 text-zinc-400 hover:text-zinc-200 font-bold text-xs px-1"
                            title="Deselect segment"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <span className="text-xs text-zinc-400 italic">
                        Click any segment in 3D to inspect severity
                    </span>
                )}
            </div>

            {/* Scale Bar Container with Dynamic Pin Indicator */}
            <div className="relative my-2 px-1">
                {/* Dynamic Pin Indicator for Selected Segment */}
                {indicatorPosPct !== null && (
                    <div
                        className="absolute -top-7 -translate-x-1/2 flex flex-col items-center transition-all duration-300 ease-out z-50 pointer-events-none drop-shadow-xl"
                        style={{ left: `${indicatorPosPct}%` }}
                    >
                        <div
                            className="px-2 py-1 rounded text-xs font-bold font-mono text-black shadow-lg flex items-center gap-1"
                            style={{ backgroundColor: getIntegrityColor(selectedIntegrity!) }}
                        >
                            <span>{selectedSegmentId}</span>
                            <span>({indicatorPosPct}%)</span>
                        </div>
                        <div
                            className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]"
                            style={{ borderTopColor: getIntegrityColor(selectedIntegrity!) }}
                        ></div>
                    </div>
                )}

                {/* Main Gradient Bar */}
                <div
                    className="w-full h-3 rounded-full border border-industrial-700/80 shadow-inner relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(to right, #ef4444 0%, #ef4444 30%, #f59e0b 30%, #f59e0b 60%, #10b981 60%, #10b981 80%, #3b82f6 80%, #3b82f6 100%)',
                    }}
                >
                    {/* Tick mark dividers */}
                    <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-black/60"></div>
                    <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-black/60"></div>
                    <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-black/60"></div>
                </div>

                {/* Percentage Tick Labels */}
                <div className="relative w-full text-[10px] font-mono text-zinc-400 mt-1 h-3">
                    <span className="absolute left-0">0%</span>
                    <span className="absolute left-[30%] -translate-x-1/2">30%</span>
                    <span className="absolute left-[60%] -translate-x-1/2">60%</span>
                    <span className="absolute left-[80%] -translate-x-1/2">80%</span>
                    <span className="absolute right-0">100%</span>
                </div>
            </div>

            {/* Severity Category Legend Strip - Sleek Industrial Design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-industrial-800/80">
                {severityCategories.map((cat) => (
                    <div
                        key={cat.label}
                        className="flex items-center justify-between px-2.5 py-1.5 bg-industrial-950 rounded border border-industrial-800/70"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color }}
                            ></span>
                            <span className="text-xs font-medium text-zinc-300 truncate">{cat.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-1">{cat.range}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
