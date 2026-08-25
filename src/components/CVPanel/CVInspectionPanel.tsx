import { useState } from 'react';
import { usePipelineStore } from '../../store/usePipelineStore';
import ExternalSurfaceFeed from './ExternalSurfaceFeed';
import FeedbackControls from './FeedbackControls';

const CLASS_LABELS: Record<string, string> = {
    BX: 'Box Defect',
    CJ: 'Corrosion Joint',
    CK: 'Crack',
    OBB: 'Object/Blockage',
    PL: 'Peeling',
    SG: 'Surface Gouging',
    ZW: 'Zone Wear',
    none: 'No Defect',
};

const CLASS_COLORS: Record<string, string> = {
    BX: '#f59e0b',
    CJ: '#ef4444',
    CK: '#dc2626',
    OBB: '#8b5cf6',
    PL: '#f97316',
    SG: '#ec4899',
    ZW: '#06b6d4',
    none: '#6b7280',
};

/**
 * CV Inspection Panel - External pipeline surface corrosion detection via YOLOv8-Seg
 * Includes real YOLO inference trigger + human-in-the-loop feedback controls
 */
export default function CVInspectionPanel() {
    const selectedSegmentId = usePipelineStore(state => state.selectedSegmentId);
    const segments = usePipelineStore(state => state.segments);
    const updateSegment = usePipelineStore(state => state.updateSegment);

    const selectedSegment = selectedSegmentId ? segments.get(selectedSegmentId) : null;
    const cvData = selectedSegment?.cv;

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzeError, setAnalyzeError] = useState<string | null>(null);

    const handleRunYOLO = async () => {
        if (!selectedSegmentId) return;
        setIsAnalyzing(true);
        setAnalyzeError(null);

        try {
            const res = await fetch('http://localhost:3001/api/cv/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ segment_id: selectedSegmentId }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || `HTTP ${res.status}`);
            }

            const result = await res.json();
            // Patch local store immediately (WebSocket will also update, but this is instant)
            if (result.success && result.cv) {
                updateSegment(selectedSegmentId, { cv: result.cv });
            }
        } catch (e: unknown) {
            setAnalyzeError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const isYolo = cvData?.is_yolo_result === true;
    const className = cvData?.class_name ?? 'none';
    const classColor = CLASS_COLORS[className] ?? '#6b7280';
    const classLabel = CLASS_LABELS[className] ?? className;

    return (
        <div className="panel h-full flex flex-col">
            <div className="panel-header">
                <div className="flex items-center justify-between">
                    <span>External Damage &amp; Surface Inspection</span>
                    <div className="flex items-center gap-2">
                        {selectedSegmentId && (
                            <span className="text-sm text-zinc-300 font-mono font-bold px-2 py-0.5 rounded bg-industrial-900 border border-industrial-700">
                                {selectedSegmentId}
                            </span>
                        )}
                        {isYolo && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded border"
                                style={{ color: '#22d3ee', borderColor: '#164e63', background: '#0c2233' }}>
                                YOLO LIVE
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {!selectedSegmentId ? (
                    <div className="flex-1 flex items-center justify-center text-zinc-400">
                        <div className="text-center px-6">
                            <svg className="w-14 h-14 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">Select a pipeline segment to view external surface inspection</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 overflow-auto space-y-3">
                        {/* External Pipe Wall SVG Inspector */}
                        <div style={{ height: '170px' }} className="bg-[#050505] rounded-lg overflow-hidden border border-industrial-700 w-full">
                            <ExternalSurfaceFeed segmentId={selectedSegmentId} />
                        </div>

                        {/* Run YOLO Analysis button */}
                        <button
                            onClick={handleRunYOLO}
                            disabled={isAnalyzing}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                            style={{
                                background: isAnalyzing ? '#1e293b' : 'linear-gradient(135deg, #0e7490, #0c4a6e)',
                                color: isAnalyzing ? '#64748b' : '#e0f2fe',
                                border: '1px solid #164e63',
                                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isAnalyzing ? (
                                <>
                                    {/* Spinner */}
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Running YOLOv8 Inference…
                                </>
                            ) : (
                                <>
                                    {/* YOLO icon */}
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                                    </svg>
                                    Run YOLOv8 Segmentation Analysis
                                </>
                            )}
                        </button>

                        {/* Error state */}
                        {analyzeError && (
                            <div className="rounded-lg px-3 py-2 text-xs font-mono"
                                style={{ background: '#1c0a0a', border: '1px solid #7f1d1d', color: '#fca5a5' }}>
                                ? {analyzeError}
                            </div>
                        )}

                        {/* Detection metadata */}
                        {cvData && (
                            <div className="grid grid-cols-2 gap-3">
                                {/* Corrosion Area */}
                                <div className="inner-card p-3">
                                    <div className="text-xs text-zinc-400 mb-1">External Corrosion Area</div>
                                    <div className="text-2xl font-bold text-critical">
                                        {cvData.corrosion_surface_pct.toFixed(1)}%
                                    </div>
                                </div>

                                {/* Detection Confidence */}
                                <div className="inner-card p-3">
                                    <div className="text-xs text-zinc-400 mb-1">Detection Confidence</div>
                                    <div className="text-2xl font-bold text-zinc-200">
                                        {(cvData.confidence * 100).toFixed(0)}%
                                    </div>
                                </div>

                                {/* Class Name — only shown for real YOLO results */}
                                {isYolo && (
                                    <>
                                        <div className="inner-card p-3">
                                            <div className="text-xs text-zinc-400 mb-1">Defect Class</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold font-mono" style={{ color: classColor }}>
                                                    {className.toUpperCase()}
                                                </span>
                                                <span className="text-xs text-zinc-400">{classLabel}</span>
                                            </div>
                                        </div>

                                        <div className="inner-card p-3">
                                            <div className="text-xs text-zinc-400 mb-1">Detection Rate</div>
                                            <div className="text-2xl font-bold text-zinc-200">
                                                {((cvData.detection_rate ?? 0) * 100).toFixed(0)}%
                                            </div>
                                            <div className="text-[10px] text-zinc-500 mt-0.5">
                                                {cvData.frames_with_detections ?? 0}/{cvData.total_frames ?? 0} frames
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Timestamp */}
                                <div className="inner-card col-span-2 p-3">
                                    <div className="text-xs text-zinc-400 mb-1">
                                        {isYolo ? 'YOLO Inference Timestamp' : 'Optical Scan Timestamp'}
                                    </div>
                                    <div className="text-sm font-mono text-zinc-300">
                                        {new Date(cvData.frame_timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Human-in-the-loop feedback */}
                        {cvData && <FeedbackControls segmentId={selectedSegmentId} cvData={cvData} />}
                    </div>
                )}
            </div>
        </div>
    );
}
