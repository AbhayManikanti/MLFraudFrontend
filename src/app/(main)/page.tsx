import { PerformanceDashboard } from '@/components/dashboard/performance-dashboard';
import { ManualAnalysis } from '@/components/dashboard/manual-analysis';
import { LiveFeed } from '@/components/dashboard/live-feed';
import { Separator } from '@/components/ui/separator';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';

export default function AnalystDashboardPage() {
  return (
    <div className="space-y-12 pb-12">
      <div className="animate-fade-in">
        <PerformanceDashboard />
      </div>
      <Separator className="animate-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'both' }} />
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
        <ManualAnalysis />
      </div>
      <Separator className="animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'both' }} />
      <div className="animate-fade-in-up" style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
        <LiveFeed />
      </div>
      <Separator className="animate-fade-in" style={{ animationDelay: '1000ms', animationFillMode: 'both' }} />
      <div className="animate-fade-in-up" style={{ animationDelay: '1100ms', animationFillMode: 'both' }}>
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
