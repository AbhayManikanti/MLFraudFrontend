'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { modelComparisonData } from '@/lib/data';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  accuracy: {
    label: 'Accuracy',
    color: 'hsl(var(--chart-1))',
  },
  precision: {
    label: 'Precision',
    color: 'hsl(var(--chart-2))',
  },
  recall: {
    label: 'Recall',
    color: 'hsl(var(--chart-4))',
  },
};

export function ModelComparisonChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis
                dataKey="model"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                fontSize={12}
                domain={[98, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                content={<ChartTooltipContent />}
              />
              <Legend />
              <Bar dataKey="accuracy" fill="var(--color-accuracy)" name="Accuracy" radius={[4, 4, 0, 0]} />
              <Bar dataKey="precision" fill="var(--color-precision)" name="Precision" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recall" fill="var(--color-recall)" name="Recall" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
