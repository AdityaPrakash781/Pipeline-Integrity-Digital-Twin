import { useState } from 'react';
import { usePipelineStore } from '../../store/usePipelineStore';
import type { CVOutput, FeedbackEntry } from '../../types';

interface FeedbackControlsProps {
    segmentId: string;
    cvData: CVOutput;
}

/**
 * Human-in-the-loop feedback controls for CV detections
 * Allows operators to confirm or reject detections
 */
export default function FeedbackControls({ segmentId, cvData }: FeedbackControlsProps) {
    const [feedbackGiven, setFeedbackGiven] = useState(false);
    const [feedbackType, setFeedbackType] = useState<'confirm' | 'false_positive' | null>(null);
    const addFeedback = usePipelineStore(state => state.addFeedback);
    const feedbackQueue = usePipelineStore(state => state.feedbackQueue);

    const handleFeedback = (type: 'confirm' | 'false_positive') => {
        const feedback: FeedbackEntry = {
            segment_id: segmentId,
            detection_timestamp: cvData.frame_timestamp,
            feedback_type: type,
            timestamp: new Date().toISOString()
        };

        addFeedback(feedback);
        setFeedbackGiven(true);
        setFeedbackType(type);

        // Reset after 2 seconds
        setTimeout(() => {
            setFeedbackGiven(false);
            setFeedbackType(null);
        }, 2000);
    };

    return (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-zinc-800/60 p-5 shadow-2xl backdrop-blur-md transition-all duration-300">
            {/* Background glow effects */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/80 border border-zinc-700/50 shadow-inner">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-medium tracking-wide text-zinc-100 drop-shadow-sm">Human Verification</h3>
                </div>
                {feedbackQueue.length > 0 && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold tracking-wider text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        {feedbackQueue.length} QUEUE
                    </span>
                )}
            </div>

            <div className="relative z-10 flex gap-4">
                <button
                    onClick={() => handleFeedback('confirm')}
                    disabled={feedbackGiven}
                    className={`relative flex-1 group overflow-hidden rounded-lg p-[1px] transition-all duration-300 ${
                        feedbackGiven 
                            ? (feedbackType === 'confirm' ? 'opacity-100 scale-[1.02]' : 'opacity-40 grayscale') 
                            : 'hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    }`}
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/40 to-teal-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900/90 border border-zinc-700/50 group-hover:border-emerald-500/30 rounded-lg backdrop-blur-sm transition-all duration-300">
                        <svg className={`w-5 h-5 transition-colors duration-300 ${feedbackType === 'confirm' ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`font-medium tracking-wide text-sm transition-colors duration-300 ${feedbackType === 'confirm' ? 'text-emerald-300' : 'text-zinc-300 group-hover:text-emerald-300'}`}>Confirm</span>
                    </div>
                </button>

                <button
                    onClick={() => handleFeedback('false_positive')}
                    disabled={feedbackGiven}
                    className={`relative flex-1 group overflow-hidden rounded-lg p-[1px] transition-all duration-300 ${
                        feedbackGiven 
                            ? (feedbackType === 'false_positive' ? 'opacity-100 scale-[1.02]' : 'opacity-40 grayscale') 
                            : 'hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                    }`}
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-red-500/40 to-orange-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900/90 border border-zinc-700/50 group-hover:border-red-500/30 rounded-lg backdrop-blur-sm transition-all duration-300">
                        <svg className={`w-5 h-5 transition-colors duration-300 ${feedbackType === 'false_positive' ? 'text-red-400' : 'text-zinc-400 group-hover:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className={`font-medium tracking-wide text-sm transition-colors duration-300 ${feedbackType === 'false_positive' ? 'text-red-300' : 'text-zinc-300 group-hover:text-red-300'}`}>Reject</span>
                    </div>
                </button>
            </div>

            <div className={`relative z-10 mt-4 overflow-hidden transition-all duration-500 ease-in-out ${feedbackGiven ? 'h-8 opacity-100' : 'h-0 opacity-0'}`}>
                <div className={`flex items-center justify-center gap-2 text-sm font-medium ${feedbackType === 'confirm' ? 'text-emerald-400' : 'text-red-400'}`}>
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Feedback recorded
                </div>
            </div>

            <div className={`relative z-10 mt-3 text-[11px] text-center uppercase tracking-widest text-zinc-500 font-semibold transition-all duration-500 ${feedbackGiven ? 'hidden' : 'block'}`}>
                Refining YOLOv8-Seg Accuracy
            </div>
        </div>
    );
}
