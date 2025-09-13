import type { LucideIcon } from 'lucide-react';
import type { ExplainTransactionFraudOutput } from '@/ai/flows/explain-transaction-fraud';

export type PerformanceMetric = {
  name: 'Accuracy' | 'Precision' | 'Recall' | 'F1-Score';
  value: string;
  icon: LucideIcon;
};

export type ConfusionMatrixData = {
  trueNegative: number;
  falsePositive: number;
  falseNegative: number;
  truePositive: number;
};

export type RocPoint = {
  fpr: number;
  tpr: number;
};

export type TransactionType = 'legitimate' | 'fraudulent' | 'random';

export type PredictionResult = ExplainTransactionFraudOutput & {
  isFraud: boolean;
  probability: number;
  actualClass?: 'Legitimate' | 'Fraudulent';
};

export type LiveTransaction = {
  id: string;
  isFraud: boolean;
  probability: number;
  topFactor: ExplainTransactionFraudOutput['influencingFactors'][0];
};

export type SimulatorFeatures = {
  distance_from_home: number;
  ratio_to_median_purchase_price: number;
  repeat_retailer: boolean;
  used_chip: boolean;
  used_pin_number: boolean;
  online_order: boolean;
};

export type ModelComparisonData = {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
};
