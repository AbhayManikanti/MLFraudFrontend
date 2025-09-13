'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { PredictionExplanation } from './prediction-explanation';
import { fraudAPI, type PredictionResponse, type Transaction } from '@/lib/fraud-api';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ManualAnalysisResult {
  transaction: Transaction;
  prediction: PredictionResponse;
  actualClass: 'Legitimate' | 'Fraudulent';
  // For compatibility with PredictionExplanation component
  isFraud: boolean;
  probability: number;
  explanation: string;
  influencingFactors: Array<{
    feature: string;
    impact: string;
    importance: number;
  }>;
}

export function ManualAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ManualAnalysisResult | null>(null);
  const { toast } = useToast();

  const handleTestTransaction = async (type: 'legitimate' | 'fraud' | 'any') => {
    setLoading(true);
    setResult(null);

    try {
      // Use the backend API to get a random transaction and prediction
      const testResult = await fraudAPI.testPrediction(type);
      
      // Transform the API response to match our component interface
      const analysisResult: ManualAnalysisResult = {
        transaction: testResult.transaction,
        prediction: testResult.prediction,
        actualClass: testResult.actual_class === 'Fraud' ? 'Fraudulent' : 'Legitimate',
        isFraud: testResult.prediction.is_fraud,
        probability: testResult.prediction.fraud_probability,
        explanation: `ML Model Analysis: The transaction has been ${testResult.prediction.is_fraud ? 'flagged as potentially fraudulent' : 'classified as legitimate'} based on the following key features.`,
        influencingFactors: testResult.prediction.top_features?.map((feature, index) => ({
          feature: feature.feature,
          impact: feature.impact_on_fraud === 'INCREASES' ? 'Increases fraud risk' : 'Decreases fraud risk',
          importance: feature.importance
        })) || []
      };
      
      setResult(analysisResult);
      
      toast({
        title: 'Analysis Complete',
        description: `Transaction analyzed: ${testResult.prediction.is_fraud ? 'FRAUD DETECTED' : 'SECURE'}`,
      });
    } catch (error) {
      console.error('Error analyzing transaction:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not connect to the ML backend. Please check your connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold">Manual Transaction Analysis</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Button
          variant="success"
          size="lg"
          onClick={() => handleTestTransaction('legitimate')}
          disabled={loading}
          className="h-auto py-3 whitespace-normal"
        >
          Test Random Legitimate Transaction
        </Button>
        <Button
          variant="destructive"
          size="lg"
          onClick={() => handleTestTransaction('fraud')}
          disabled={loading}
          className="h-auto py-3 whitespace-normal"
        >
          Test Random Fraudulent Transaction
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={() => handleTestTransaction('any')}
          disabled={loading}
          className="h-auto py-3 whitespace-normal"
        >
          Test Any Random Transaction
        </Button>
      </div>

      <Card className="min-h-[300px] flex items-center justify-center">
        <CardContent className="pt-6 w-full">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Analyzing transaction...</p>
            </div>
          )}

          {!loading && !result && (
            <div className="text-center text-muted-foreground">
              Click a button to test a transaction.
            </div>
          )}

          {!loading && result && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                {result.isFraud ? (
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    <XCircle className="mr-2 h-5 w-5" />
                    Fraud Alert
                  </Badge>
                ) : (
                  <Badge className="bg-success text-success-foreground text-lg px-4 py-2 hover:bg-success/90">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Secure
                  </Badge>
                )}
                <p className="text-2xl font-bold">
                  Fraud Probability: {(result.probability * 100).toFixed(2)}%
                </p>
                {result.actualClass && (
                  <p className="text-sm text-muted-foreground">
                    (Actual Class: {result.actualClass})
                  </p>
                )}
              </div>
              <PredictionExplanation result={result} />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
