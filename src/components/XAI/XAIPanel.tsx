import { usePipelineStore } from '../../store/usePipelineStore';
import ContributionChart from './ContributionChart';
import ExplanationText from './ExplanationText';
import ConfidenceMeter from './ConfidenceMeter';

/**
 * XAI (Explainable AI) Panel - Shows feature contributions and model explanations
 */
export default function XAIPanel() {
    const selectedSegmentId = usePipelineStore(state => state.selectedSegmentId);
    const segments = usePipelineStore(state => state.segments);

    const selectedSegment = selectedSegmentId ? segments.get(selectedSegmentId) : null;
    const xaiData = selectedSegment?.xai;

    return (
        <div className="panel h-full flex flex-col">
            <div className="panel-header">
                <span>Explainable AI Diagnostics</span>
            </div>

            <div className="flex-1 p-4 overflow-auto">
                {!selectedSegmentId || !xaiData ? (
                    <div className="h-full flex items-center justify-center text-zinc-400">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p>Select a segment with XAI data to view explanations</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Model Confidence */}
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-zinc-200 mb-2">
                                    Model Confidence
                                </h3>
                                <p className="text-xs text-zinc-400">
                                    Overall prediction reliability
                                </p>
                            </div>
                            <ConfidenceMeter confidence={xaiData.model_confidence} />
                        </div>

                        {/* Feature Contributions */}
                        <div className="inner-card p-4">
                            <h3 className="text-sm font-semibold text-zinc-200 mb-4">
                                Top Contributing Factors
                            </h3>
                            <ContributionChart contributors={xaiData.contributors} />

                            <div className="mt-4 text-xs text-zinc-400 italic">
                                SHAP-style feature importance analysis. Values represent percentage contribution to the degradation forecast.
                            </div>
                        </div>

                        {/* Natural Language Explanation */}
                        <div className="inner-card p-4">
                            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
                                Engineering Explanation
                            </h3>
                            <ExplanationText xaiData={xaiData} />
                        </div>

                        {/* Trust & Transparency Note */}
                        <div className="inner-card p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <div>
                                    <div className="text-sm font-semibold text-zinc-300 mb-1">
                                        Explainability & Trust
                                    </div>
                                    <div className="text-xs text-zinc-400">
                                        This system never operates as a black box. Every prediction is backed by physics-based models
                                        and transparent feature contributions, allowing engineers to verify and validate the AI's reasoning.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
