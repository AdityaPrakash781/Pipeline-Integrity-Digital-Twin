import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { PINNOutput } from '../../types';

interface IntegrityChartProps {
    pinnData: PINNOutput;
}

/**
 * Dual-line time series chart showing historical and predicted integrity
 */
export default function IntegrityChart({ pinnData }: IntegrityChartProps) {
    // Combine historical and predicted data
    const chartData = [
        ...pinnData.historical_integrity.map(point => ({
            time: new Date(point.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            historical: point.value,
            predicted: null,
            fullDate: point.time
        })),
        ...pinnData.predicted_integrity.map(point => ({
            time: new Date(point.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            historical: null,
            predicted: point.value,
            fullDate: point.time
        }))
    ];

    // Find the transition point (today)
    const todayIndex = pinnData.historical_integrity.length - 1;
    const todayDate = chartData[todayIndex]?.time || '';

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#94a3b8"
                    domain={[0, 100]}
                    label={{ value: 'Integrity (%)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8' } }}
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                    }}
                    formatter={(value: any) => [`${value?.toFixed(1)}%`, '']}
                />
                <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                />

                {/* Today marker */}
                <ReferenceLine
                    x={todayDate}
                    stroke="#22d3ee"
                    strokeDasharray="3 3"
                    label={{ value: 'Today', position: 'top', fill: '#22d3ee', fontSize: 12 }}
                />

                {/* Historical data line */}
                <Line
                    type="monotone"
                    dataKey="historical"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    name="Historical Sensor Integrity"
                    connectNulls={false}
                />

                {/* Predicted data line (dashed) */}
                <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#f97316"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#f97316', r: 3 }}
                    name="Physics-Constrained Prediction"
                    connectNulls={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
