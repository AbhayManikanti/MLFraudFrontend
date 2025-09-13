'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { fraudAPI, type LiveFeedData } from '@/lib/fraud-api';
import { ArrowDown, ArrowUp, CheckCircle, XCircle, Loader2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LiveTransaction {
  id: string;
  isFraud: boolean;
  probability: number;
  amount: number;
  topFactor: {
    feature: string;
    impact: 'INCREASES' | 'DECREASES';
    importance: number;
  };
  timestamp: string;
  actualClass: string;
  rawTransaction: any; // Full transaction data
  allFeatures: Array<{
    feature: string;
    impact: string;
    importance: number;
  }>;
}

export function LiveFeed() {
  const [isLive, setIsLive] = useState(false);
  const [transactions, setTransactions] = useState<LiveTransaction[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const { toast } = useToast();

  const transformLiveFeedData = (data: LiveFeedData): LiveTransaction => {
    const topFeature = data.prediction.top_features?.[0];
    return {
      id: `${Date.now()}-${Math.random()}`,
      isFraud: data.prediction.is_fraud,
      probability: data.prediction.fraud_probability,
      amount: data.transaction.Amount || 0,
      topFactor: {
        feature: topFeature?.feature || 'Unknown',
        impact: topFeature?.impact_on_fraud || 'INCREASES',
        importance: topFeature?.importance || 0,
      },
      timestamp: data.timestamp || new Date().toISOString(),
      actualClass: data.actual_class,
      rawTransaction: data.transaction,
      allFeatures: data.prediction.top_features?.map((feature) => ({
        feature: feature.feature,
        impact: feature.impact_on_fraud === 'INCREASES' ? 'Increases fraud risk' : 'Decreases fraud risk',
        importance: feature.importance
      })) || []
    };
  };

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    setConnectionStatus('connecting');
    
    try {
      wsRef.current = fraudAPI.createWebSocketConnection(
        // onMessage
        (data: LiveFeedData) => {
          console.log('Received live feed data:', data);
          const transaction = transformLiveFeedData(data);
          setTransactions(prev => [transaction, ...prev.slice(0, 9)]); // Keep last 10
          setConnectionStatus('connected');
          reconnectAttempts.current = 0; // Reset on successful message
        },
        // onError
        (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('error');
          
          // Attempt to reconnect
          if (isLive && reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Exponential backoff, max 30s
            
            toast({
              title: 'Reconnecting...',
              description: `Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`,
            });
            
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isLive) {
                connectWebSocket();
              }
            }, delay);
          } else {
            toast({
              variant: 'destructive',
              title: 'Connection Failed',
              description: 'Could not establish connection to live feed after multiple attempts.',
            });
            setIsLive(false);
          }
        },
        // onClose
        (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          setConnectionStatus('disconnected');
          
          if (event.code !== 1000 && isLive) { // Not a normal close and should still be live
            // Attempt to reconnect
            if (reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current++;
              const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
              
              toast({
                title: 'Connection Lost',
                description: `Reconnecting in ${delay/1000}s... (${reconnectAttempts.current}/${maxReconnectAttempts})`,
              });
              
              reconnectTimeoutRef.current = setTimeout(() => {
                if (isLive) {
                  connectWebSocket();
                }
              }, delay);
            } else {
              toast({
                variant: 'destructive',
                title: 'Connection Lost',
                description: 'Live feed connection failed after multiple attempts.',
              });
              setIsLive(false);
            }
          } else if (event.code === 1000) {
            setIsLive(false);
          }
        }
      );
      
      // Set a timeout for connection establishment
      const connectionTimeout = setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CONNECTING) {
          wsRef.current.close();
          setConnectionStatus('error');
          toast({
            variant: 'destructive',
            title: 'Connection Timeout',
            description: 'Could not connect to live feed. The backend may be unavailable.',
          });
        }
      }, 10000); // 10 second timeout
      
      // Clear timeout once connection is established
      if (wsRef.current) {
        const originalOnOpen = wsRef.current.onopen;
        wsRef.current.onopen = (event) => {
          clearTimeout(connectionTimeout);
          setConnectionStatus('connected');
          reconnectAttempts.current = 0;
          console.log('WebSocket connected successfully');
          if (originalOnOpen && wsRef.current) {
            originalOnOpen.call(wsRef.current, event);
          }
        };
      }
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Could not initialize WebSocket connection. Please check your network.',
      });
      setIsLive(false);
    }
  };

  const disconnectWebSocket = () => {
    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    reconnectAttempts.current = 0;
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      disconnectWebSocket();
    };
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleLiveFeed = () => {
    if (isLive) {
      setIsLive(false);
      disconnectWebSocket();
    } else {
      setIsLive(true);
      connectWebSocket();
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'connecting': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-xl font-bold animate-slide-in-right" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            Live Transaction Stream
          </h2>
          <div className={`flex items-center gap-2 text-sm ${getStatusColor()} animate-fade-in`} style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            {getStatusIcon()}
            <span className="capitalize">{connectionStatus === 'connected' ? 'Connected to Backend' : connectionStatus}</span>
          </div>
        </div>
        <div className="animate-scale-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <Button 
            onClick={toggleLiveFeed}
            disabled={connectionStatus === 'connecting'}
            className={`${isLive ? 'animate-pulse-glow' : ''} transition-all duration-300`}
          >
            {connectionStatus === 'connecting' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : isLive ? 'Stop Live Feed' : 'Start Live Feed'}
          </Button>
        </div>
      </div>
      <Card className="min-h-[400px] hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
        <CardContent className="p-4 space-y-2">
          {!transactions.length && !isLive && (
            <div className="h-full flex items-center justify-center text-muted-foreground pt-16 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
              <p>Start the live feed to see real-time transactions from the ML backend.</p>
            </div>
          )}
          {!transactions.length && isLive && (
            <div className="h-full flex items-center justify-center text-muted-foreground pt-16 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
              <p>Waiting for live transactions...</p>
            </div>
          )}
          {transactions.map((tx, index) => (
            <Collapsible
              key={tx.id}
              open={expandedItems.has(tx.id)}
              onOpenChange={() => toggleExpanded(tx.id)}
            >
              <Card 
                className="animate-fade-in-up hover:shadow-lg transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {tx.isFraud ? (
                          <XCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${tx.isFraud ? 'text-destructive' : 'text-green-600'}`}>
                              {tx.isFraud ? 'Fraud Alert' : 'Secure'}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              ${tx.amount.toFixed(2)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {(tx.probability * 100).toFixed(1)}% probability | Actual: {tx.actualClass}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground text-right">
                          <div>{new Date(tx.timestamp).toLocaleTimeString()}</div>
                          <div className="flex items-center gap-1">
                            <span>{tx.topFactor.feature}</span>
                            {tx.topFactor.impact === 'INCREASES' ? 
                              <ArrowUp className="h-3 w-3 text-destructive" /> : 
                              <ArrowDown className="h-3 w-3 text-green-500" />
                            }
                          </div>
                        </div>
                        {expandedItems.has(tx.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Transaction Details */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Transaction Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="ml-2 font-mono">${tx.amount.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Time:</span>
                            <span className="ml-2">{tx.rawTransaction.Time || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* ML Analysis */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">ML Analysis</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Fraud Probability:</span>
                            <Badge variant={tx.isFraud ? 'destructive' : 'secondary'}>
                              {(tx.probability * 100).toFixed(2)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Model Prediction:</span>
                            <Badge variant={tx.isFraud ? 'destructive' : 'default'}>
                              {tx.isFraud ? 'FRAUD' : 'LEGITIMATE'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Actual Class:</span>
                            <Badge variant="outline">
                              {tx.actualClass}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Feature Analysis */}
                      {tx.allFeatures.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Top Influencing Features</h4>
                          <div className="space-y-1">
                            {tx.allFeatures.slice(0, 5).map((feature, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="font-mono">{feature.feature}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">
                                    {feature.importance.toFixed(1)}%
                                  </span>
                                  <Badge 
                                    variant={feature.impact.includes('Increases') ? 'destructive' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {feature.impact.includes('Increases') ? '↑ Risk' : '↓ Risk'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
