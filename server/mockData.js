/**
 * Mock data generators for CV, PINN, and XAI outputs
 * Simulates realistic ML model outputs for 10 pipeline segments
 */

const SEGMENT_COUNT = 60; // Increased length for a more impressive pipeline
const SEGMENT_LENGTH = 2; // meters

/**
 * Generate initial segment data
 */
function generateSegments() {
    const segments = [];

    // We trace the curve using small steps and place a segment every SEGMENT_LENGTH distance.
    const amplitudeY = 3;
    const frequencyY = 0.08;
    const amplitudeZ = 8;
    const frequencyZ = 0.12;

    // Helper to get point on curve
    const getPoint = (t) => {
        return [
            t,
            Math.sin(t * frequencyY) * amplitudeY,
            Math.sin(t * frequencyZ) * amplitudeZ
        ];
    };
    
    // Helper to get derivative (tangent) on curve
    const getTangent = (t) => {
        return [
            1,
            Math.cos(t * frequencyY) * frequencyY * amplitudeY,
            Math.cos(t * frequencyZ) * frequencyZ * amplitudeZ
        ];
    };

    let currentT = -(SEGMENT_COUNT * SEGMENT_LENGTH) / 2;

    for (let i = 0; i < SEGMENT_COUNT; i++) {
        const segmentId = `SEG-${String(i + 1).padStart(3, '0')}`;
        // Generate a random integrity score between 0.1 and 0.95
        const integrity = 0.1 + (Math.random() * 0.85);
        
        const position = getPoint(currentT);
        const direction = getTangent(currentT);

        segments.push({
            segment_id: segmentId,
            position: position,
            direction: direction,
            integrity: integrity,
            cv: generateCVOutput(segmentId, integrity),
            pinn: generatePINNOutput(segmentId, integrity),
            xai: generateXAIOutput(segmentId, integrity),
            lastUpdated: new Date().toISOString()
        });

        // Advance currentT by approximately SEGMENT_LENGTH
        // dt = ds / ||tangent||
        const tangent = getTangent(currentT);
        const tangentLength = Math.sqrt(tangent[0]*tangent[0] + tangent[1]*tangent[1] + tangent[2]*tangent[2]);
        currentT += SEGMENT_LENGTH / tangentLength;
    }

    return segments;
}

/**
 * Generate CV (Computer Vision) output
 */
function generateCVOutput(segmentId, integrity) {
    const corrosionPct = (1 - integrity) * 100 * (0.8 + Math.random() * 0.4);
    const confidence = 0.7 + Math.random() * 0.25;

    // Generate polygon mask (normalized coordinates)
    const polygonMask = [
        [0.4 + Math.random() * 0.1, 0.3 + Math.random() * 0.1],
        [0.5 + Math.random() * 0.1, 0.3 + Math.random() * 0.1],
        [0.55 + Math.random() * 0.1, 0.4 + Math.random() * 0.1],
        [0.5 + Math.random() * 0.1, 0.45 + Math.random() * 0.1],
        [0.4 + Math.random() * 0.1, 0.4 + Math.random() * 0.1]
    ];

    return {
        segment_id: segmentId,
        corrosion_surface_pct: Math.max(0, Math.min(100, corrosionPct)),
        confidence: confidence,
        polygon_mask: polygonMask,
        frame_timestamp: new Date().toISOString()
    };
}

/**
 * Generate PINN (Physics-Informed Neural Network) output
 */
function generatePINNOutput(segmentId, integrity) {
    const now = new Date();
    const historical = [];
    const predicted = [];

    // Generate 6 months of historical data
    for (let i = 180; i >= 0; i -= 15) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Simulate gradual degradation
        const historicalIntegrity = Math.min(100, integrity * 100 + (180 - i) * 0.1 + Math.random() * 5);

        historical.push({
            time: date.toISOString(),
            value: historicalIntegrity
        });
    }

    // Generate 6 months of predicted data (physics-based decay)
    const currentIntegrity = integrity * 100;
    const decayRate = (1 - integrity) * 0.15; // Faster decay for lower integrity

    for (let i = 1; i <= 180; i += 15) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);

        // Exponential-like decay based on Fick's 2nd Law simulation
        const predictedIntegrity = Math.max(0, currentIntegrity - (decayRate * i) - Math.random() * 2);

        predicted.push({
            time: date.toISOString(),
            value: predictedIntegrity
        });
    }

    // Calculate RUL (days until integrity drops below 20%)
    const criticalThreshold = 20;
    const daysToFailure = Math.max(30, (currentIntegrity - criticalThreshold) / decayRate);

    return {
        segment_id: segmentId,
        historical_integrity: historical,
        predicted_integrity: predicted,
        remaining_useful_life_days: Math.round(daysToFailure),
        governing_equation: 'Fick_2nd_Law'
    };
}

/**
 * Generate XAI (Explainable AI) output
 */
function generateXAIOutput(segmentId, integrity) {
    const features = [
        'Surface Corrosion (CV)',
        'Humidity Exposure',
        'Material Age',
        'Temperature Cycles',
        'Pressure Fluctuations',
        'Chemical Exposure'
    ];

    // Generate random contributions that sum to 100%
    const rawContributions = features.map(() => Math.random());
    const sum = rawContributions.reduce((a, b) => a + b, 0);
    const normalizedContributions = rawContributions.map(c => (c / sum) * 100);

    const contributors = features.map((feature, index) => ({
        feature: feature,
        contribution_pct: normalizedContributions[index]
    }));

    // Sort by contribution and take top 5
    contributors.sort((a, b) => b.contribution_pct - a.contribution_pct);
    const topContributors = contributors.slice(0, 5);

    // Renormalize to 100%
    const topSum = topContributors.reduce((a, b) => a + b.contribution_pct, 0);
    topContributors.forEach(c => c.contribution_pct = (c.contribution_pct / topSum) * 100);

    return {
        segment_id: segmentId,
        contributors: topContributors,
        model_confidence: 0.65 + Math.random() * 0.3
    };
}

/**
 * Update a random segment with new data
 */
function updateRandomSegment(segments) {
    const index = Math.floor(Math.random() * segments.length);
    const segment = segments[index];

    // Slight integrity degradation
    segment.integrity = Math.max(0.1, segment.integrity - Math.random() * 0.02);

    // Update CV, PINN, XAI data
    segment.cv = generateCVOutput(segment.segment_id, segment.integrity);
    segment.pinn = generatePINNOutput(segment.segment_id, segment.integrity);
    segment.xai = generateXAIOutput(segment.segment_id, segment.integrity);
    segment.lastUpdated = new Date().toISOString();

    return segment;
}

export {
    generateSegments,
    updateRandomSegment
};
