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

    // Color palette for bars
    const colors = ['#ef4444', '#f59e0b', '#22d3ee'];

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart
                data={topContributors}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                    type="category"
                    dataKey="feature"
                    stroke="#94a3b8"
                    width={150}
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#f1f5f9'
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
    );
}
