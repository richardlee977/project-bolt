import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart2,
  Clock,
  Eye,
  MessageSquare,
  Share2,
  ThumbsUp
} from 'lucide-react';
import { useState } from 'react';

interface ABTest {
  id: string;
  variantA: {
    content: string;
    image?: string;
    metrics: {
      impressions: number;
      engagement: number;
      clicks: number;
      shares: number;
    };
  };
  variantB: {
    content: string;
    image?: string;
    metrics: {
      impressions: number;
      engagement: number;
      clicks: number;
      shares: number;
    };
  };
  duration: number; // in hours
  status: 'running' | 'completed';
  winner?: 'A' | 'B';
}

export default function ABTesting() {
  const [tests] = useState<ABTest[]>([
    {
      id: '1',
      variantA: {
        content: "🌟 Try our new seasonal menu! Fresh ingredients, bold flavors.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554",
        metrics: {
          impressions: 1200,
          engagement: 180,
          clicks: 45,
          shares: 12
        }
      },
      variantB: {
        content: "🍽️ Introducing new dishes! Experience culinary excellence.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554",
        metrics: {
          impressions: 1350,
          engagement: 220,
          clicks: 60,
          shares: 18
        }
      },
      duration: 24,
      status: 'running'
    }
  ]);

  const calculateEngagementRate = (metrics: typeof tests[0]['variantA']['metrics']) => {
    return ((metrics.engagement / metrics.impressions) * 100).toFixed(1);
  };

  const getWinningVariant = (test: ABTest) => {
    const engagementA = calculateEngagementRate(test.variantA.metrics);
    const engagementB = calculateEngagementRate(test.variantB.metrics);
    return parseFloat(engagementA) > parseFloat(engagementB) ? 'A' : 'B';
  };

  return (
    <div className="space-y-6">
      {tests.map((test) => (
        <Card key={test.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                A/B Test Results
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {test.status === 'running' ? `${test.duration}h remaining` : 'Completed'}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['A', 'B'].map((variant) => {
                const data = variant === 'A' ? test.variantA : test.variantB;
                const isWinner = test.status === 'completed' && getWinningVariant(test) === variant;
                
                return (
                  <Card key={variant} className={`${
                    isWinner ? 'ring-2 ring-primary' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Variant {variant}</h3>
                        {isWinner && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Winner
                          </span>
                        )}
                      </div>

                      {data.image && (
                        <div className="aspect-video rounded-lg overflow-hidden mb-4">
                          <img 
                            src={data.image} 
                            alt={`Variant ${variant}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <p className="text-sm mb-4">{data.content}</p>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Eye className="h-4 w-4" /> Impressions
                            </span>
                            <span>{data.metrics.impressions.toLocaleString()}</span>
                          </div>
                          <Progress value={
                            (data.metrics.impressions / Math.max(test.variantA.metrics.impressions, test.variantB.metrics.impressions)) * 100
                          } />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" /> Engagement Rate
                            </span>
                            <span>{calculateEngagementRate(data.metrics)}%</span>
                          </div>
                          <Progress value={parseFloat(calculateEngagementRate(data.metrics))} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" /> Clicks
                            </span>
                            <span className="text-lg font-medium">
                              {data.metrics.clicks}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Share2 className="h-4 w-4" /> Shares
                            </span>
                            <span className="text-lg font-medium">
                              {data.metrics.shares}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="mr-2">
                View Details
              </Button>
              {test.status === 'completed' && (
                <Button>
                  Apply Winning Version
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}