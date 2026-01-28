import { useState } from 'react';
import { usePipelineStore } from '../../store/usePipelineStore';

/**
 * Collapsible sidebar with telemetry information
 */
export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const wsConnected = usePipelineStore(state => state.wsConnected);
    const feedbackQueue = usePipelineStore(state => state.feedbackQueue);
    const segments = usePipelineStore(state => state.segments);

    // Calculate statistics
    const segmentArray = Array.from(segments.values());
    const criticalCount = segmentArray.filter(s => s.integrity < 0.3).length;
    const warningCount = segmentArray.filter(s => s.integrity >= 0.3 && s.integrity < 0.6).length;

    if (collapsed) {
        return (
            <div className="bg-industrial-800 border-r border-industrial-700 p-2 flex flex-col items-center">
                <button
                    onClick={() => setCollapsed(false)}
                    className="p-2 hover:bg-industrial-700 rounded transition-colors"
                    title="Expand sidebar"
                >
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div className="bg-industrial-800 border-r border-industrial-700 w-64 flex flex-col">
            <div className="p-4 border-b border-industrial-700 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">Telemetry</h2>
                <button
                    onClick={() => setCollapsed(true)}
                    className="p-1 hover:bg-industrial-700 rounded transition-colors"
                    title="Collapse sidebar"
                >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-auto">
                {/* Connection Status */}
                <div>
                    <div className="text-xs text-slate-400 mb-2">Connection</div>
                    <div className={`status-badge ${wsConnected ? 'bg-healthy/20 text-healthy' : 'bg-critical/20 text-critical'}`}>
                        {wsConnected ? '● Online' : '○ Offline'}
                    </div>
                </div>

                {/* Segment Statistics */}
                <div>
                    <div className="text-xs text-slate-400 mb-2">Segment Status</div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">Total</span>
                            <span className="font-semibold text-slate-100">{segments.size}</span>
                        </div>
                        {criticalCount > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-critical">Critical</span>
                                <span className="font-semibold text-critical">{criticalCount}</span>
                            </div>
                        )}
                        {warningCount > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-warning">Warning</span>
                                <span className="font-semibold text-warning">{warningCount}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Feedback Queue */}
                <div>
                    <div className="text-xs text-slate-400 mb-2">Feedback Queue</div>
                    <div className="text-2xl font-bold text-healthy">
                        {feedbackQueue.length}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                        Pending retraining
                    </div>
                </div>

                {/* System Info */}
                <div className="pt-4 border-t border-industrial-700">
                    <div className="text-xs text-slate-400 space-y-1">
                        <div>YOLOv8-Seg: Active</div>
                        <div>PINN Engine: Running</div>
                        <div>XAI Module: Enabled</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
