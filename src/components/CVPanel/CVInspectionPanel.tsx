import { usePipelineStore } from '../../store/usePipelineStore';
import VideoFeed from './VideoFeed';
import DetectionOverlay from './DetectionOverlay';
import FeedbackControls from './FeedbackControls';

/**
 * CV Inspection Panel - Shows video feed with corrosion detection overlays
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
                    <span>Computer Vision Inspection</span>
                    {selectedSegmentId && (
                        <span className="text-sm text-healthy font-mono">{selectedSegmentId}</span>
                    )}
                </div>
            </div>

            <div className="flex-1 p-4 overflow-auto">
                {!selectedSegmentId ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p>Select a pipeline segment to view inspection data</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Video feed with detection overlay */}
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                            <VideoFeed segmentId={selectedSegmentId} />
                            {cvData && <DetectionOverlay cvData={cvData} />}
                        </div>

                        {/* Detection metadata */}
                        {cvData && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-industrial-900 rounded-lg p-3">
                                    <div className="text-xs text-slate-400 mb-1">Corrosion Surface</div>
                                    <div className="text-2xl font-bold text-critical">
                                        {cvData.corrosion_surface_pct.toFixed(1)}%
                                    </div>
                                </div>

                                <div className="bg-industrial-900 rounded-lg p-3">
                                    <div className="text-xs text-slate-400 mb-1">Confidence</div>
                                    <div className="text-2xl font-bold text-healthy">
                                        {(cvData.confidence * 100).toFixed(0)}%
                                    </div>
                                </div>

                                <div className="col-span-2 bg-industrial-900 rounded-lg p-3">
                                    <div className="text-xs text-slate-400 mb-1">Detection Time</div>
                                    <div className="text-sm font-mono text-slate-300">
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
