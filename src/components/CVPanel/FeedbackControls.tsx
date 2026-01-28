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

        // Reset after 2 seconds
        setTimeout(() => setFeedbackGiven(false), 2000);
    };

    return (
        <div className="bg-industrial-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-200">Human Verification</h3>
                {feedbackQueue.length > 0 && (
                    <span className="status-badge bg-healthy/20 text-healthy">
                        {feedbackQueue.length} in queue
                    </span>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => handleFeedback('confirm')}
                    disabled={feedbackGiven}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Detection
                </button>

                <button
                    onClick={() => handleFeedback('false_positive')}
                    disabled={feedbackGiven}
                    className="flex-1 btn-danger disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    False Positive
                </button>
            </div>

            {feedbackGiven && (
                <div className="mt-3 text-center text-sm text-healthy animate-pulse">
                    ✓ Feedback recorded
                </div>
            )}

            <div className="mt-4 text-xs text-slate-400 italic">
                Your feedback helps improve the YOLOv8-Seg model accuracy
            </div>
        </div>
    );
}
