'use client';

import { rocCurveData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  tpr: {
    label: 'Tuned XGBoost',
    color: 'hsl(var(--primary))',
  },
  fpr: {
    label: 'Random Classifier',
    color: 'hsl(var(--muted-foreground))',
  },
};

export function RocCurveChart() {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
      <CardHeader>
        <CardTitle className="group-hover:text-primary transition-colors duration-200">ROC Curve</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-scale-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={rocCurveData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="fpr" 
                  type="number"
                  domain={[0, 1]}
                  label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -10 }} 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  domain={[0, 1]}
                  label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', offset: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="tpr" name="Tuned XGBoost" stroke="var(--color-tpr)" fill="var(--color-tpr)" fillOpacity={0.3} strokeWidth={2} />
                <Area type="monotone" dataKey="fpr" name="Random Classifier" stroke="var(--color-fpr)" strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
