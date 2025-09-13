import type { PredictionResult } from '@/lib/types';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type PredictionExplanationProps = {
  result: PredictionResult;
};

export function PredictionExplanation({ result }: PredictionExplanationProps) {
  const sortedFactors = [...result.influencingFactors].sort((a, b) => b.importance - a.importance);

  return (
    <div>
      <h3 className="font-semibold text-foreground">Top Influencing Factors</h3>
      <p className="text-sm text-muted-foreground mb-4">
        AI-generated explanation of the transaction analysis (SHAP).
      </p>
      <div className="space-y-4">
        {sortedFactors.map((factor) => {
          const isIncrease = factor.impact === 'INCREASES';
          return (
            <div key={factor.feature} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  {isIncrease ? (
                    <ArrowUp className="h-4 w-4 mr-1 text-destructive" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1 text-success" />
                  )}
                  <span className="font-medium">{factor.feature}</span>
                </div>
                <Progress
                  value={factor.importance}
                  className={`h-2 [&>*]:bg-${isIncrease ? 'destructive' : 'success'}`}
                />
              </div>
              <div className="text-sm font-semibold">{factor.importance.toFixed(2)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
