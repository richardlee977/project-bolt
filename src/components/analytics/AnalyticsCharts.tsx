import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

interface ChartProps {
  data: any[];
  previousPeriodData?: any[];
  type: 'line' | 'area' | 'bar';
  dataKey: string;
  title: string;
  description?: string;
}

export default function AnalyticsChart({ 
  title,
  description 
}: ChartProps) {
  useAppStore();


  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {/* <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer> */}
        </div>
      </CardContent>
    </Card>
  );
}