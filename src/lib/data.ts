import {
  Blend,
  Crosshair,
  Repeat,
  Target,
} from 'lucide-react';
import type {
  PerformanceMetric,
  ConfusionMatrixData,
  RocPoint,
  ModelComparisonData,
} from '@/lib/types';

export const performanceMetrics: PerformanceMetric[] = [
  { name: 'Accuracy', value: '99.93%', icon: Target },
  { name: 'Precision', value: '76.85%', icon: Crosshair },
  { name: 'Recall', value: '84.69%', icon: Repeat },
  { name: 'F1-Score', value: '80.58%', icon: Blend },
];

export const confusionMatrixData: ConfusionMatrixData = {
  trueNegative: 284315,
  falsePositive: 113,
  falseNegative: 75,
  truePositive: 417,
};

export const rocCurveData: RocPoint[] = [
  { fpr: 0.0, tpr: 0.0 },
  { fpr: 0.0, tpr: 0.1 },
  { fpr: 0.0, tpr: 0.3 },
  { fpr: 0.0001, tpr: 0.5 },
  { fpr: 0.0002, tpr: 0.75 },
  { fpr: 0.0003, tpr: 0.84 },
  { fpr: 0.0004, tpr: 0.8469 },
  { fpr: 0.1, tpr: 0.9 },
  { fpr: 0.2, tpr: 0.92 },
  { fpr: 0.5, tpr: 0.95 },
  { fpr: 1.0, tpr: 1.0 },
];

export const sampleTransactions = {
  legitimate: {
    transactionFeatures: {
      V1: -1.3598071336738,
      V2: -0.0727811733098497,
      V3: 2.53634673796914,
      V4: 1.37815522427443,
      V10: 0.0907941719781762,
      V11: -0.551599516753199,
      V12: -0.617800855762348,
      V14: -0.311169353699879,
      V17: 0.207971241979243,
    },
    prediction: false,
    probability: 0.0123,
  },
  fraudulent: {
    transactionFeatures: {
      V1: -2.3122265423263,
      V2: 1.95199201064158,
      V3: -1.60985073229729,
      V4: 3.9979055875468,
      V10: -1.54073849202393,
      V11: -2.21959719543789,
      V12: -3.61952543543168,
      V14: -2.03020286845341,
      V17: -2.6023319881323,
    },
    prediction: true,
    probability: 0.9876,
  },
};

export const modelComparisonData: ModelComparisonData[] = [
  { model: 'Tuned XGBoost', accuracy: 99.93, precision: 76.85, recall: 84.69 },
  { model: 'Logistic Regression', accuracy: 99.89, precision: 68.42, recall: 55.32 },
  { model: 'Random Forest', accuracy: 99.91, precision: 72.5, recall: 74.47 },
  { model: 'SVM', accuracy: 99.9, precision: 70.1, recall: 65.96 },
];

export const geoHeatmapData: Record<string, number> = {
  US: 95,
  CA: 80,
  MX: 70,
  BR: 85,
  GB: 75,
  FR: 65,
  DE: 68,
  RU: 90,
  CN: 88,
  IN: 82,
  AU: 78,
};
