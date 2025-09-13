'use client';

import { useState, useMemo } from 'react';
import type { SimulatorFeatures } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Gauge } from '@/components/shared/gauge';

const initialFeatures: SimulatorFeatures = {
  distance_from_home: 10,
  ratio_to_median_purchase_price: 1,
  repeat_retailer: true,
  used_chip: true,
  used_pin_number: true,
  online_order: false,
};

export function InteractiveSimulator() {
  const [features, setFeatures] = useState<SimulatorFeatures>(initialFeatures);

  const handleSliderChange = (key: keyof SimulatorFeatures, value: number[]) => {
    setFeatures(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleSwitchChange = (key: keyof SimulatorFeatures, checked: boolean) => {
    setFeatures(prev => ({ ...prev, [key]: checked }));
  };

  const fraudProbability = useMemo(() => {
    let score = 0;
    score += features.distance_from_home * 0.3; // max 30
    score += features.ratio_to_median_purchase_price * 5; // max 50
    score += features.repeat_retailer ? 0 : 5;
    score += features.used_chip ? 0 : 10;
    score += features.used_pin_number ? 0 : 20;
    score += features.online_order ? 15 : 0;
    return Math.min(score, 100);
  }, [features]);

  const prediction = fraudProbability > 50 ? 'High Risk' : 'Low Risk';

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold animate-fade-in">Interactive Fraud Simulator</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="animate-slide-in-right hover:shadow-lg transition-all duration-300 group" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <CardHeader>
            <CardTitle className="group-hover:text-primary transition-colors duration-200">Create a Custom Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
              <Label className="text-sm font-medium">Distance from Home: {features.distance_from_home.toFixed(1)} km</Label>
              <Slider
                value={[features.distance_from_home]}
                onValueChange={(v) => handleSliderChange('distance_from_home', v)}
                max={100}
                step={0.1}
                className="hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
              <Label className="text-sm font-medium">Ratio to Median Purchase: {features.ratio_to_median_purchase_price.toFixed(1)}x</Label>
              <Slider
                value={[features.ratio_to_median_purchase_price]}
                onValueChange={(v) => handleSliderChange('ratio_to_median_purchase_price', v)}
                max={10}
                step={0.1}
                className="hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex items-center justify-between animate-fade-in-up group/item hover:bg-accent/50 p-2 rounded-lg transition-all duration-200" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
              <Label className="group-hover/item:text-primary transition-colors duration-200">Repeat Retailer</Label>
              <Switch
                checked={features.repeat_retailer}
                onCheckedChange={(c) => handleSwitchChange('repeat_retailer', c)}
                className="hover:scale-110 transition-transform duration-200"
              />
            </div>
            <div className="flex items-center justify-between animate-fade-in-up group/item hover:bg-accent/50 p-2 rounded-lg transition-all duration-200" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
              <Label className="group-hover/item:text-primary transition-colors duration-200">Used Chip</Label>
              <Switch
                checked={features.used_chip}
                onCheckedChange={(c) => handleSwitchChange('used_chip', c)}
                className="hover:scale-110 transition-transform duration-200"
              />
            </div>
            <div className="flex items-center justify-between animate-fade-in-up group/item hover:bg-accent/50 p-2 rounded-lg transition-all duration-200" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
              <Label className="group-hover/item:text-primary transition-colors duration-200">Used PIN Number</Label>
              <Switch
                checked={features.used_pin_number}
                onCheckedChange={(c) => handleSwitchChange('used_pin_number', c)}
                className="hover:scale-110 transition-transform duration-200"
              />
            </div>
            <div className="flex items-center justify-between animate-fade-in-up group/item hover:bg-accent/50 p-2 rounded-lg transition-all duration-200" style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
              <Label className="group-hover/item:text-primary transition-colors duration-200">Online Order</Label>
              <Switch
                checked={features.online_order}
                onCheckedChange={(c) => handleSwitchChange('online_order', c)}
                className="hover:scale-110 transition-transform duration-200"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center animate-scale-in hover:shadow-lg transition-all duration-300 group" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <CardHeader>
            <CardTitle className="group-hover:text-primary transition-colors duration-200">Real-Time Results</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center space-y-8 w-full">
            <div className="animate-bounce-in" style={{ animationDelay: '1000ms', animationFillMode: 'both' }}>
              <Gauge value={fraudProbability} />
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '1200ms', animationFillMode: 'both' }}>
              <p className="text-lg font-semibold">Prediction: 
                <span className={`${prediction === 'High Risk' ? 'text-destructive animate-pulse-glow' : 'text-success'} transition-colors duration-300`}>
                  {' '}{prediction}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
