/**
 * Data Contracts for Digital Twin Pipeline Integrity System
 * These interfaces mirror the outputs from ML models (CV, PINN, XAI)
 * and must match the production API specifications exactly.
 */

/**
 * Computer Vision Output - YOLOv8-Seg corrosion detection
 */
export interface CVOutput {
    segment_id: string;
    corrosion_surface_pct: number; // 0-100: percentage of surface area affected
    confidence: number; // 0-1: model confidence in detection
    polygon_mask: number[][]; // normalized [x, y] coordinates for corrosion region
    frame_timestamp: string; // ISO 8601 date string

    // Real YOLOv8 inference fields (populated when Run YOLO Analysis is triggered)
    corrosion_detected?: boolean;
    class_id?: number;           // -1 if no detection
    class_name?: string;         // 'BX'|'CJ'|'CK'|'OBB'|'PL'|'SG'|'ZW'|'none'
    severity_score?: number;     // raw model confidence of best detection (0-1)
    detection_rate?: number;     // frames_with_detections / total_frames
    total_frames?: number;
    frames_with_detections?: number;
    yolo_mask_px?: number[][];   // raw pixel coords [x,y] from YOLO (640x640 space)
    is_yolo_result?: boolean;    // true when populated by real inference
}

/**
 * Physics-Informed Neural Network Output - Subsurface degradation forecast
 */
export interface PINNOutput {
    segment_id: string;
    historical_integrity: Array<{ time: string; value: number }>; // Past sensor readings
    predicted_integrity: Array<{ time: string; value: number }>; // Future projections
    remaining_useful_life_days: number; // Days until critical threshold
    governing_equation: 'Fick_2nd_Law'; // Physics model used
}

/**
 * Explainable AI Output - SHAP-style feature contributions
 */
export interface XAIOutput {
    segment_id: string;
    contributors: Array<{
        feature: string; // Feature name (e.g., "Surface Corrosion", "Humidity")
        contribution_pct: number; // Percentage contribution (must sum to 100)
    }>;
    model_confidence: number; // 0-1: overall model confidence
}

/**
 * Unified segment data combining all outputs
 */
export interface SegmentData {
    segment_id: string;
    position: [number, number, number]; // 3D position in scene
    direction?: [number, number, number]; // 3D direction vector
    integrity: number; // 0-1: current integrity (1 = healthy, 0 = critical)
    cv?: CVOutput;
    pinn?: PINNOutput;
    xai?: XAIOutput;
    lastUpdated: string; // ISO timestamp
}

/**
 * Human-in-the-loop feedback for CV detections
 */
export interface FeedbackEntry {
    segment_id: string;
    detection_timestamp: string;
    feedback_type: 'confirm' | 'false_positive';
    user_id?: string;
    timestamp: string;
}

/**
 * WebSocket message types
 */
export interface WSMessage {
    type: 'segment_update' | 'cv_detection' | 'pinn_forecast' | 'xai_explanation' | 'initial_data';
    data: SegmentData | CVOutput | PINNOutput | XAIOutput | SegmentData[];
    timestamp: string;
}

/**
 * Urgency levels for RUL (Remaining Useful Life)
 */
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Chart data point for time series
 */
export interface ChartDataPoint {
    time: string;
    value: number;
    label?: string;
}

/**
 * YOLO Analysis API response
 */
export interface YOLOAnalysisResult {
    segment_id: string;
    cv: CVOutput;
    success: boolean;
    error?: string;
}
