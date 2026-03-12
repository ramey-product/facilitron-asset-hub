"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useConditionStats } from "@/hooks/use-conditions";

interface ConditionTrendChartProps {
  assetId: number;
}

/**
 * Simple SVG-based condition trend chart.
 * Uses the scoreHistory from condition stats to render a line chart.
 * Avoids Recharts dependency for this lightweight use case.
 */
export function ConditionTrendChart({ assetId }: ConditionTrendChartProps) {
  const { data, isLoading } = useConditionStats(assetId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="h-32 w-full animate-pulse rounded bg-[var(--muted)]" />
        </CardContent>
      </Card>
    );
  }

  const history = data?.data?.scoreHistory ?? [];

  if (history.length < 2) {
    return (
      <Card>
        <CardContent className="p-5 text-center">
          <p className="text-xs text-[var(--muted-foreground)]">
            Need at least 2 data points for a trend chart.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Chart dimensions
  const width = 500;
  const height = 150;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Scale: Y is 0.5-5.5 (to give breathing room around 1-5)
  const yMin = 0.5;
  const yMax = 5.5;
  const scaleY = (score: number) =>
    padding.top + chartH - ((score - yMin) / (yMax - yMin)) * chartH;

  const scaleX = (i: number) =>
    padding.left + (i / (history.length - 1)) * chartW;

  // Build polyline points
  const points = history
    .map((p, i) => `${scaleX(i)},${scaleY(p.score)}`)
    .join(" ");

  // Area fill
  const areaPoints = [
    `${scaleX(0)},${scaleY(yMin)}`,
    ...history.map((p, i) => `${scaleX(i)},${scaleY(p.score)}`),
    `${scaleX(history.length - 1)},${scaleY(yMin)}`,
  ].join(" ");

  // Score colors
  const scoreColor = (score: number) => {
    if (score >= 4.5) return "#10b981";
    if (score >= 3.5) return "#22c55e";
    if (score >= 2.5) return "#f59e0b";
    if (score >= 1.5) return "#f97316";
    return "#ef4444";
  };

  const lastScore = history[history.length - 1]?.score ?? 3;
  const lineColor = scoreColor(lastScore);

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
          Condition Trend
        </h3>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          aria-label="Condition score trend over time"
        >
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map((score) => (
            <g key={score}>
              <line
                x1={padding.left}
                y1={scaleY(score)}
                x2={width - padding.right}
                y2={scaleY(score)}
                stroke="currentColor"
                className="text-[var(--border)]"
                strokeWidth={0.5}
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 8}
                y={scaleY(score) + 3}
                textAnchor="end"
                className="text-[var(--muted-foreground)]"
                fill="currentColor"
                fontSize={10}
              >
                {score}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <polygon
            points={areaPoints}
            fill={lineColor}
            opacity={0.1}
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={lineColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {history.map((p, i) => (
            <circle
              key={i}
              cx={scaleX(i)}
              cy={scaleY(p.score)}
              r={3}
              fill={scoreColor(p.score)}
              stroke="white"
              strokeWidth={1.5}
            />
          ))}

          {/* X-axis labels (first and last date) */}
          <text
            x={scaleX(0)}
            y={height - 5}
            textAnchor="start"
            className="text-[var(--muted-foreground)]"
            fill="currentColor"
            fontSize={9}
          >
            {new Date(history[0]!.date).toLocaleDateString("en-US", {
              month: "short",
              year: "2-digit",
            })}
          </text>
          <text
            x={scaleX(history.length - 1)}
            y={height - 5}
            textAnchor="end"
            className="text-[var(--muted-foreground)]"
            fill="currentColor"
            fontSize={9}
          >
            {new Date(
              history[history.length - 1]!.date
            ).toLocaleDateString("en-US", {
              month: "short",
              year: "2-digit",
            })}
          </text>
        </svg>
      </CardContent>
    </Card>
  );
}
