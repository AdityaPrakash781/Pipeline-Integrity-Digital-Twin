import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ContributionChartProps {
    contributors: Array<{ feature: string; contribution_pct: number }>;
}

/**
 * SHAP-style horizontal bar chart showing feature contributions
 */
export default function ContributionChart({ contributors }: ContributionChartProps) {
    // Sort by contribution (descending) and take top 3
    const topContributors = [...contributors]
        .sort((a, b) => b.contribution_pct - a.contribution_pct)
        .slice(0, 3);

    // Color palette for bars — muted metallic palette, no neon
    const colors = ['#ef4444', '#f59e0b', '#a1a1aa'];

    return (
        <div style={{ background: '#0f0f10', borderRadius: '0.5rem' }}>
        <ResponsiveContainer width="100%" height={200}>
            <BarChart
                data={topContributors}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                style={{ background: '#0f0f10' }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.08} horizontal={false} />
                <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke="#71717a"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                    type="category"
                    dataKey="feature"
                    stroke="#71717a"
                    width={150}
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#171718',
                        border: '1px solid #38383c',
                        borderRadius: '8px',
                        color: '#f4f4f5'
                    }}
                    formatter={(value: any) => [`${value.toFixed(1)}%`, 'Contribution']}
                />
                <Bar dataKey="contribution_pct" radius={[0, 4, 4, 0]}>
                    {topContributors.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        </div>
    );
}
