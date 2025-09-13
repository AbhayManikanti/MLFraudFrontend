import { confusionMatrixData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ConfusionMatrix() {
  const { trueNegative, falsePositive, falseNegative, truePositive } = confusionMatrixData;

  const Cell = ({ value, label, colorClass }: { value: number; label: string; colorClass?: string }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounce-in ${colorClass || 'bg-secondary/50'}`}>
      <span className="text-2xl font-bold">{value.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
      <CardHeader>
        <CardTitle className="group-hover:text-primary transition-colors duration-200">Confusion Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_1fr_1fr] grid-rows-[auto_1fr_1fr] items-center gap-2 text-center text-sm">
          <div></div>
          <div className="font-bold text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>Predicted Negative</div>
          <div className="font-bold text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>Predicted Positive</div>

          <div className="font-bold text-muted-foreground [writing-mode:vertical-rl] rotate-180 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>Actual Negative</div>
          <div className="animate-scale-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
            <Cell value={trueNegative} label="True Negative" colorClass="bg-green-500/20 text-green-500" />
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
            <Cell value={falsePositive} label="False Positive" colorClass="bg-red-500/20 text-red-500" />
          </div>

          <div className="font-bold text-muted-foreground [writing-mode:vertical-rl] rotate-180 animate-fade-in" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>Actual Positive</div>
          <div className="animate-scale-in" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
            <Cell value={falseNegative} label="False Negative" colorClass="bg-red-500/20 text-red-500" />
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
            <Cell value={truePositive} label="True Positive" colorClass="bg-green-500/20 text-green-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
