import { usePipelineStore } from '../../store/usePipelineStore';
import { formatTime } from '../../utils/colors';

/**
 * Application header with title and system status
 */
export default function Header() {
    const wsConnected = usePipelineStore(state => state.wsConnected);
    const lastUpdate = usePipelineStore(state => state.lastUpdate);
    const segments = usePipelineStore(state => state.segments);

    return (
        <header className="bg-industrial-800 border-b border-industrial-700 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">
                        Pipeline Integrity Digital Twin
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        AI-Driven Infrastructure Monitoring System
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Segment count */}
                    <div className="text-right">
                        <div className="text-xs text-slate-400">Active Segments</div>
                        <div className="text-lg font-semibold text-healthy">
                            {segments.size}
                        </div>
                    </div>

                    {/* WebSocket status */}
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-healthy animate-pulse' : 'bg-critical'
                                }`}
                        />
                        <span className="text-sm text-slate-300">
                            {wsConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>

                    {/* Last update */}
                    {lastUpdate && (
                        <div className="text-right">
                            <div className="text-xs text-slate-400">Last Update</div>
                            <div className="text-sm font-mono text-slate-300">
                                {formatTime(lastUpdate)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
