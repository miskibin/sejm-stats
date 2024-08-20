import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  Label,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PolarViewBox } from "recharts/types/util/types";

interface ChartProps {
  data: any[];
  title: string;
  type: "line" | "bar" | "donut";
  dataKeys: string[];
  xAxisDataKey: string;
  colors: string[];
  visibleKeys: string[];
  layout?: "vertical" | "horizontal";
  stacked?: boolean;
  toggleKey: (key: string) => void;
  customLabels?: { [key: string]: string };
  centerText?: {
    primaryText: string | number;
    secondaryText: string;
  };
}

const CustomTooltip = ({
  active,
  payload,
  label,
  customLabels,
}: TooltipProps<any, any> & { customLabels?: { [key: string]: string } }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-2 text-sm">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            className="text-foreground"
            style={{ color: entry.color }}
          >
            {(customLabels &&
              customLabels[entry.dataKey as keyof typeof customLabels]) ||
              entry.dataKey}
            : {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const wrapText = (text: string, maxWidth: number): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxWidth) {
      currentLine += " " + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};

const CustomYAxisTick = ({ x, y, payload }: any) => {
  const lines = wrapText(payload.value, 20);
  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={-6}
          y={index * 12}
          dy={12}
          textAnchor="end"
          fill="currentColor"
          className="text-sm"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export const ReusableChart: React.FC<ChartProps> = ({
  data,
  title,
  type,
  dataKeys,
  xAxisDataKey,
  colors,
  visibleKeys,
  layout = "horizontal",
  stacked = false,
  toggleKey,
  customLabels,
  centerText,
}) => {
  const totalValue = useMemo(() => {
    if (type === "donut") {
      return data.reduce((acc, curr) => acc + curr[dataKeys[0]], 0);
    }
    return 0;
  }, [data, dataKeys, type]);

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data} layout={layout}>
            {layout === "horizontal" ? (
              <>
                <XAxis dataKey={xAxisDataKey} tick={{ fill: "currentColor" }} />
                <YAxis tick={{ fill: "currentColor" }} />
              </>
            ) : (
              <>
                <XAxis type="number" tick={{ fill: "currentColor" }} />
                <YAxis
                  dataKey={xAxisDataKey}
                  type="category"
                  width={130}
                  tick={<CustomYAxisTick />}
                />
              </>
            )}
            <Tooltip content={<CustomTooltip customLabels={customLabels} />} />
            {dataKeys.map(
              (key, index) =>
                visibleKeys.includes(key) && (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    strokeWidth={3}
                    dot={false}
                  />
                )
            )}
          </LineChart>
        );
      case "bar":
        return (
          <BarChart data={data} layout={layout}>
            {layout === "horizontal" ? (
              <>
                <XAxis dataKey={xAxisDataKey} tick={{ fill: "currentColor" }} />
                <YAxis tick={{ fill: "currentColor" }} />
              </>
            ) : (
              <>
                <XAxis type="number" tick={{ fill: "currentColor" }} />
                <YAxis
                  dataKey={xAxisDataKey}
                  type="category"
                  width={130}
                  tick={<CustomYAxisTick />}
                />
              </>
            )}
            <Tooltip content={<CustomTooltip customLabels={customLabels} />} />
            {dataKeys.map(
              (key, index) =>
                visibleKeys.includes(key) && (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[index % colors.length]}
                    stackId={stacked ? "stack" : undefined}
                  />
                )
            )}
          </BarChart>
        );
      case "donut":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKeys[0]}
              nameKey={xAxisDataKey}
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={6}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox) {
                    const { cx, cy } = (viewBox as PolarViewBox);
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        <tspan
                          x={cx}
                          y={cy}
                          dy="-0.5em"
                          className="fill-foreground text-xl font-bold"
                        >
                          {centerText ? centerText.primaryText : totalValue}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy}
                          dy="1.5em"
                          className="fill-muted-foreground text-sm"
                        >
                          {centerText ? centerText.secondaryText : "Total"}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
            <Tooltip content={<CustomTooltip customLabels={customLabels} />} />
            <Legend />
          </PieChart>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <Card className="w-full px-1 h-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-4">
        <div className="h-[40vh] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        {type !== "donut" && (
          <div className="flex flex-wrap justify-center gap-4 items-center my-3">
            {dataKeys.map((key, index) => (
              <button
                key={key}
                onClick={() => toggleKey(key)}
                className={`text-sm font-medium leading-none cursor-pointer select-none ${
                  visibleKeys.includes(key) ? "" : "opacity-50"
                }`}
                style={{ color: colors[index % colors.length] }}
              >
                {customLabels?.[key] || key}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
