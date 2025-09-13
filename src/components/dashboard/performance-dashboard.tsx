import { StatCard } from '@/components/dashboard/stat-card';
import { performanceMetrics } from '@/lib/data';
import { ConfusionMatrix } from './confusion-matrix';
import { RocCurveChart } from './roc-curve-chart';

export function PerformanceDashboard() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold animate-fade-in">Tuned XGBoost Model Performance</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric, index) => (
          <div
            key={metric.name}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <StatCard metric={metric} />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="animate-slide-in-right" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <ConfusionMatrix />
        </div>
        <div className="animate-slide-in-right" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
          <RocCurveChart />
        </div>
      </div>
    </section>
  );
}
