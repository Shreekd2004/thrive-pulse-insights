import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";

interface PerformanceChartProps {
  data: Array<{
    month: string;
    performance: number;
    goals: number;
    feedback: number;
  }>;
  type?: 'line' | 'bar';
}

const chartConfig = {
  performance: {
    label: "Performance",
    color: "hsl(var(--primary))",
  },
  goals: {
    label: "Goals Completed",
    color: "hsl(var(--secondary))",
  },
  feedback: {
    label: "Feedback Score",
    color: "hsl(173, 87%, 31%)",
  },
};

export default function PerformanceChart({ data, type = 'line' }: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          {type === 'line' ? (
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="var(--color-performance)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-performance)" }}
              />
              <Line 
                type="monotone" 
                dataKey="goals" 
                stroke="var(--color-goals)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-goals)" }}
              />
              <Line 
                type="monotone" 
                dataKey="feedback" 
                stroke="var(--color-feedback)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-feedback)" }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="performance" fill="var(--color-performance)" />
              <Bar dataKey="goals" fill="var(--color-goals)" />
              <Bar dataKey="feedback" fill="var(--color-feedback)" />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}