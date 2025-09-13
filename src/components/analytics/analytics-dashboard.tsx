'use client';

import dynamic from 'next/dynamic';
import { ModelComparisonChart } from './model-comparison-chart';
import { Skeleton } from '@/components/ui/skeleton';

const GeographicDistribution = dynamic(
  () => import('./geographic-distribution').then((mod) => mod.GeographicDistribution),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[460px]" />,
  }
);


export function AnalyticsDashboard() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold">Credit Card Fraud Analytics</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <ModelComparisonChart />
        <GeographicDistribution />
      </div>
    </section>
  );
}
