import type { PerformanceMetric } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type StatCardProps = {
  metric: PerformanceMetric;
};

export function StatCard({ metric }: StatCardProps) {
  const { name, value, icon: Icon } = metric;
  return (
    <Card className="group animate-fade-in-up hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-200">
          {name}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-200" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold group-hover:text-primary transition-colors duration-200">{value}</div>
      </CardContent>
    </Card>
  );
}
