type GaugeProps = {
  value: number; // 0 to 100
};

export function Gauge({ value }: GaugeProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const angle = (clampedValue / 100) * 180 - 90;

  const getRiskColor = () => {
    if (clampedValue > 75) return 'hsl(var(--destructive))';
    if (clampedValue > 40) return 'hsl(var(--chart-4))';
    return 'hsl(var(--success))';
  };
  
  const riskColor = getRiskColor();

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center pb-16">
      <svg
        viewBox="0 0 120 70"
        className="w-full"
      >
        {/* Background Arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Foreground Arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={riskColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="157" // ~pi * 50
          strokeDashoffset={157 - (clampedValue / 100) * 157}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        {/* Needle */}
        <g transform={`rotate(${angle} 60 60)`} style={{ transition: 'transform 0.5s ease' }}>
          <path d="M 60 60 L 60 20" stroke="hsl(var(--foreground))" strokeWidth="2" />
          <circle cx="60" cy="60" r="4" fill="hsl(var(--foreground))" />
        </g>
      </svg>
      <div className="absolute bottom-2 text-center w-full">
        <span className="text-4xl font-bold transition-all duration-300" style={{ color: riskColor }}>
          {clampedValue.toFixed(1)}%
        </span>
        <p className="text-sm text-muted-foreground mt-1">Fraud Probability</p>
      </div>
    </div>
  );
}
