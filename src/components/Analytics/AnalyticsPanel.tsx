import { usePipelineStore } from '../../store/usePipelineStore';
import IntegrityChart from './IntegrityChart';
import RULWidget from './RULWidget';

/**
 * Analytics Panel - Displays PINN forecasts and integrity trends
 */
export default function AnalyticsPanel() {
    const selectedSegmentId = usePipelineStore(state => state.selectedSegmentId);
    const segments = usePipelineStore(state => state.segments);

    const selectedSegment = selectedSegmentId ? segments.get(selectedSegmentId) : null;
    const pinnData = selectedSegment?.pinn;

    return (
        <div className="panel h-full flex flex-col">
            <div className="panel-header">
                <div className="flex items-center justify-between">
                    <span>Physics-Informed Analytics</span>
                    {pinnData && (
                        <span className="text-xs text-zinc-400 font-mono">
                            {pinnData.governing_equation}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 p-4 overflow-auto">
                {!selectedSegmentId || !pinnData ? (
                    <div className="h-full flex items-center justify-center text-zinc-400">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <p>Select a segment with PINN data to view analytics</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* RUL Widget */}
                        <RULWidget rul={pinnData.remaining_useful_life_days} />

                        {/* Integrity Time Series Chart */}
                        <div className="inner-card p-4">
                            <h3 className="text-sm font-semibold text-zinc-200 mb-4">
                                Integrity Forecast
                            </h3>
                            <IntegrityChart pinnData={pinnData} />

                            <div className="mt-4 flex items-start gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-0.5 bg-zinc-400"></div>
                                    <span className="text-zinc-400">Historical Sensor Integrity</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-0.5 bg-orange-500 border-t-2 border-dashed border-orange-500"></div>
                                    <span className="text-zinc-400">Physics-Constrained Prediction</span>
                                </div>
                            </div>
                        </div>

                        {/* Physics Model Info */}
                        <div className="inner-card p-4">
                            <h3 className="text-sm font-semibold text-zinc-200 mb-2">
                                Governing Physics
                            </h3>
                            <div className="text-sm text-zinc-300 space-y-2">
                                <p>
                                    <span className="font-mono text-zinc-300 font-semibold">{pinnData.governing_equation}</span>
                                    {' '}- Diffusion-based corrosion propagation model
                                </p>
                                <p className="text-xs text-zinc-400 italic">
                                    This forecast is constrained by fundamental physics laws, not purely data-driven.
                                    The model accounts for material properties, environmental conditions, and observed degradation rates.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
