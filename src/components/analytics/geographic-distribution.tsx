
'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './mapStyles.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'North America': { lat: 37.0902, lng: -95.7129 },
  'Europe': { lat: 54.5260, lng: 15.2551 },
  'Asia Pacific': { lat: 34.0479, lng: 100.6197 },
  'South America': { lat: -8.7832, lng: -55.4915 },
  'Africa': { lat: 8.7832, lng: 34.5085 },
  'Middle East': { lat: 29.2985, lng: 42.5507 }
};

const getRiskColors = () => {
  if (typeof window === 'undefined') {
    return { high: '', medium: '', low: '' };
  }
  const rootStyle = getComputedStyle(document.documentElement);
  return {
    high: rootStyle.getPropertyValue('--destructive').trim(),
    medium: rootStyle.getPropertyValue('--chart-4').trim(),
    low: rootStyle.getPropertyValue('--success').trim(),
  }
};

const getRiskIcon = (riskLevel: string, colors: Record<string, string>) => {
  if (typeof window === 'undefined') {
    return L.divIcon({});
  }
  const color = `hsl(${colors[riskLevel as keyof typeof colors]})`;
  const strokeColor = getComputedStyle(document.documentElement).getPropertyValue('--card-foreground').trim();
  
  return L.divIcon({
    className: 'custom-marker',
    iconSize: [32, 32],
    html: `
      <svg viewBox="0 0 24 24" fill="${color}" stroke="hsl(${strokeColor})" stroke-width="1">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    `
  });
};

export const GeographicDistribution: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        attributionControl: false,
        worldCopyJump: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        className: 'map-tiles'
      }).addTo(mapInstance.current);

      const regions = [
        { name: 'North America', fraudCases: 1247, totalCases: 89234, risk: 'medium' },
        { name: 'Europe', fraudCases: 892, totalCases: 67891, risk: 'low' },
        { name: 'Asia Pacific', fraudCases: 2134, totalCases: 134567, risk: 'high' },
        { name: 'South America', fraudCases: 567, totalCases: 23456, risk: 'medium' },
        { name: 'Africa', fraudCases: 324, totalCases: 12789, risk: 'low' },
        { name: 'Middle East', fraudCases: 223, totalCases: 18923, risk: 'low' },
      ];
      
      const riskColors = getRiskColors();

      regions.forEach(region => {
        const coords = REGION_COORDINATES[region.name];
        const fraudRate = (region.fraudCases / region.totalCases * 100).toFixed(2);
        
        const marker = L.marker([coords.lat, coords.lng], {
          icon: getRiskIcon(region.risk, riskColors)
        }).addTo(mapInstance.current!);

        marker.bindTooltip(region.name, {
          direction: "top",
          opacity: 1,
          offset: [0, -15],
          className: "custom-tooltip"
        });

        const popupContent = `
          <div class="space-y-2">
            <h4 class="font-semibold text-lg">${region.name}</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-muted-foreground">Fraud Cases:</div>
              <div class="text-destructive font-semibold">${region.fraudCases.toLocaleString()}</div>
              <div class="text-muted-foreground">Total Transactions:</div>
              <div>${region.totalCases.toLocaleString()}</div>
              <div class="text-muted-foreground">Fraud Rate:</div>
              <div>${fraudRate}%</div>
            </div>
            <div class="mt-2 text-sm text-muted-foreground">
              Risk Level: <span class="font-medium" style="color: hsl(${riskColors[region.risk as keyof typeof riskColors]})">
                ${region.risk.charAt(0).toUpperCase() + region.risk.slice(1)}
              </span>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent, { className: "custom-popup" });
      });
      
      mapRef.current.classList.add('constrained-map');
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Geographic Fraud Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] p-0">
          <div ref={mapRef} className="h-full w-full rounded-b-lg map-container"></div>
        </CardContent>
    </Card>
  );
};
