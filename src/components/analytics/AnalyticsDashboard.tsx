import { useState } from 'react';
import { Users, MessageSquare, TrendingUp, Eye,Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnalyticsChart from './AnalyticsCharts';
import DateRangeSelector from './DateRangeSelector';
import ExportMenu from './ExportMenu';
import MetricCard from './MetricCard';
import { useAppStore } from '@/store/useAppStore';

// Sample data - In a real app, this would come from an API
const generateSampleData = (days: number) => {
  return Array.from({ length: days }, (_, i) => ({
    name: `Day ${i + 1}`,
    engagement: Math.floor(Math.random() * 1000),
    reach: Math.floor(Math.random() * 5000),
    impressions: Math.floor(Math.random() * 10000),
    clicks: Math.floor(Math.random() * 500)
  }));
};

export default function AnalyticsDashboard() {
  const { isDarkMode } = useAppStore();
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  const currentData = generateSampleData(7);
  const previousData = generateSampleData(7);

  const metrics = [
    {
      title: 'Total Engagement',
      value: '24.5K',
      change: 12.5,
      icon: <MessageSquare className="h-4 w-4 text-primary" />
    },
    {
      title: 'Total Reach',
      value: '98.2K',
      change: -2.3,
      icon: <Users className="h-4 w-4 text-primary" />
    },
    {
      title: 'Impressions',
      value: '144.7K',
      change: 28.4,
      icon: <Eye className="h-4 w-4 text-primary" />
    },
    {
      title: 'Click Rate',
      value: '3.2%',
      change: 4.1,
      icon: <TrendingUp className="h-4 w-4 text-primary" />
    }
  ];

  const handleExport = (format: string) => {
    // Implementation for export functionality
    console.log(`Exporting as ${format}`);
  };

  const handleShare = () => {
    // Implementation for share functionality
    console.log('Sharing analytics');
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    if (dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const handleQuickSelect = (range: string) => {
    const end = new Date();
    let start = new Date();

    switch (range) {
      case '7d':
        start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    setDateRange([start, end]);
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Range and Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DateRangeSelector
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onChange={handleDateRangeChange}
          onQuickSelect={handleQuickSelect}
        />
        <ExportMenu onExport={handleExport} onShare={handleShare} />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="area"
          data={currentData}
          previousPeriodData={previousData}
          dataKey="engagement"
          title="Engagement Over Time"
          description="Track your content's performance"
        />
        <AnalyticsChart
          type="bar"
          data={currentData}
          previousPeriodData={previousData}
          dataKey="reach"
          title="Reach Analysis"
          description="Compare your content's reach"
        />
      </div>

      {/* Detailed Metrics */}
      <Card className={`border-0 shadow-lg ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 to-background'
          : 'bg-gradient-to-br from-white to-slate-50'
      }`}>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
          <CardDescription>
            Detailed analysis of your content performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            type="line"
            data={currentData}
            previousPeriodData={previousData}
            dataKey={selectedMetric}
            title="Metric Comparison"
            description="Compare metrics over time"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {['engagement', 'reach', 'impressions', 'clicks'].map((metric) => (
              <Button
                key={metric}
                variant={selectedMetric === metric ? 'default' : 'outline'}
                onClick={() => setSelectedMetric(metric)}
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}