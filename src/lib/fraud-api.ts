// API configuration and client for fraud detection backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

// Types matching your backend
export interface Transaction {
  Time?: number; // Optional as some endpoints may not include it
  V1: number; V2: number; V3: number; V4: number; V5: number; V6: number; V7: number; V8: number; V9: number;
  V10: number; V11: number; V12: number; V13: number; V14: number; V15: number; V16: number; V17: number;
  V18: number; V19: number; V20: number; V21: number; V22: number; V23: number; V24: number;
  V25: number; V26: number; V27: number; V28: number; Amount: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  impact_on_fraud: 'INCREASES' | 'DECREASES';
}

export interface PredictionResponse {
  is_fraud: boolean;
  fraud_probability: number;
  top_features: FeatureImportance[];
}

export interface RandomTransactionResponse {
  transaction: Transaction;
  actual_class: 'Fraud' | 'Legitimate';
}

export interface LiveFeedData {
  transaction: Transaction;
  prediction: PredictionResponse;
  actual_class: 'Fraud' | 'Legitimate';
  timestamp?: string;
}

// API Client
export class FraudDetectionAPI {
  private baseUrl: string;
  private wsUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.wsUrl = WS_URL;
  }

  // Get random transaction
  async getRandomTransaction(type: 'legitimate' | 'fraud' | 'any' = 'any'): Promise<RandomTransactionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/random_transaction?transaction_type=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching random transaction:', error);
      throw error;
    }
  }

  // Predict fraud for a transaction
  async predictFraud(transaction: Transaction): Promise<PredictionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/predict_original`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error predicting fraud:', error);
      throw error;
    }
  }

  // Test flow: Get random transaction and predict (for Manual Analysis)
  async testPrediction(type: 'legitimate' | 'fraud' | 'any' = 'any'): Promise<{
    transaction: Transaction;
    prediction: PredictionResponse;
    actual_class: string;
  }> {
    try {
      const randomData = await this.getRandomTransaction(type);
      const prediction = await this.predictFraud(randomData.transaction);
      
      return {
        transaction: randomData.transaction,
        prediction,
        actual_class: randomData.actual_class,
      };
    } catch (error) {
      console.error('Error in test prediction:', error);
      throw error;
    }
  }

  // Create WebSocket connection for live feed
  createWebSocketConnection(
    onMessage: (data: LiveFeedData) => void,
    onError?: (error: Event) => void,
    onClose?: (event: CloseEvent) => void
  ): WebSocket {
    try {
      const ws = new WebSocket(`${this.wsUrl}/ws/live_feed`);

      ws.onopen = () => {
        console.log('WebSocket connected to live feed');
      };

      ws.onmessage = (event) => {
        try {
          const data: LiveFeedData = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        onClose?.(event);
      };

      return ws;
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      throw error;
    }
  }

  // Health check by testing random transaction endpoint
  async healthCheck(): Promise<{ status: string; model_loaded?: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/random_transaction?transaction_type=any`);
      if (!response.ok) {
        throw new Error(`Backend unavailable: ${response.status}`);
      }
      const data = await response.json();
      return { 
        status: 'healthy', 
        model_loaded: !!data.transaction 
      };
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const fraudAPI = new FraudDetectionAPI();