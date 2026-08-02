import { usePipelineStore } from '../../store/usePipelineStore';
import ExternalSurfaceFeed from './ExternalSurfaceFeed';
import FeedbackControls from './FeedbackControls';

/**
 * CV Inspection Panel - Focuses on external pipeline surface corrosion, exterior defects & damage
 * Includes human-in-the-loop feedback controls
 */
export default function CVInspectionPanel() {
    const selectedSegmentId = usePipelineStore(state => state.selectedSegmentId);
    const segments = usePipelineStore(state => state.segments);

    const selectedSegment = selectedSegmentId ? segments.get(selectedSegmentId) : null;
    const cvData = selectedSegment?.cv;

    return (
        <div className="panel h-full flex flex-col">
            <div className="panel-header">
                <div className="flex items-center justify-between">
                    <span>External Damage & Surface Inspection</span>
                    {selectedSegmentId && (
                        <span className="text-sm text-zinc-300 font-mono font-bold px-2 py-0.5 rounded bg-industrial-900 border border-industrial-700">{selectedSegmentId}</span>
                    )}
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

                        {/* External Detection metadata */}
                        {cvData && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="inner-card p-3">
                                    <div className="text-xs text-zinc-400 mb-1">External Corrosion Area</div>
                                    <div className="text-2xl font-bold text-critical">
                                        {cvData.corrosion_surface_pct.toFixed(1)}%
                                    </div>
                                </div>

                                <div className="inner-card p-3">
                                    <div className="text-xs text-zinc-400 mb-1">Detection Confidence</div>
                                    <div className="text-2xl font-bold text-zinc-200">
                                        {(cvData.confidence * 100).toFixed(0)}%
                                    </div>
                                </div>

                                <div className="inner-card col-span-2 p-3">
                                    <div className="text-xs text-zinc-400 mb-1">Optical Scan Timestamp</div>
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
