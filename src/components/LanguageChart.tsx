import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { LanguageStat } from '@/utils/languageStats';

interface LanguageChartProps {
  data: LanguageStat[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function LanguageChart({ data }: LanguageChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No language data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.name,
    value: item.value,
    fill: item.color,
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
