import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ArrowUp,
  Clock,
  Eye,
  Facebook,
  Heart,
  Instagram,
  Share2,
  TrendingUp,
  Twitter,
  Users,
  Youtube
} from 'lucide-react';
import { useState } from 'react';

interface PlatformMetrics {
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  growth: number;
}

interface ContentMetrics {
  type: string;
  count: number;
  engagement: number;
  bestTime: string;
}

interface AnalyticsData {
  overview: {
    totalFollowers: number;
    totalEngagement: number;
    totalReach: number;
    growthRate: number;
  };
  platforms: PlatformMetrics[];
  content: ContentMetrics[];
  topPosts: {
    title: string;
    platform: string;
    engagement: number;
    reach: number;
  }[];
}

export default function AnalyticsDashboard() {
  // Sample data - In a real app, this would come from an API
  const [timeframe, setTimeframe] = useState('7d');
  const [analyticsData] = useState<AnalyticsData>({
    overview: {
      totalFollowers: 15420,
      totalEngagement: 2845,
      totalReach: 45200,
      growthRate: 12.5
    },
    platforms: [
      {
        platform: 'Instagram',
        followers: 8500,
        engagement: 1200,
        reach: 25000,
        growth: 15.2
      },
      {
        platform: 'Facebook',
        followers: 4200,
        engagement: 850,
        reach: 12000,
        growth: 8.7
      },
      {
        platform: 'Twitter',
        followers: 2100,
        engagement: 520,
        reach: 5200,
        growth: 10.4
      },
      {
        platform: 'YouTube',
        followers: 620,
        engagement: 275,
        reach: 3000,
        growth: 25.8
      }
    ],
    content: [
      {
        type: 'Photos',
        count: 45,
        engagement: 1250,
        bestTime: '12:00 PM'
      },
      {
        type: 'Videos',
        count: 12,
        engagement: 980,
        bestTime: '6:00 PM'
      },
      {
        type: 'Stories',
        count: 85,
        engagement: 450,
        bestTime: '9:00 AM'
      },
      {
        type: 'Reels',
        count: 15,
        engagement: 2200,
        bestTime: '8:00 PM'
      }
    ],
    topPosts: [
      {
        title: "New Menu Launch",
        platform: "Instagram",
        engagement: 1200,
        reach: 15000
      },
      {
        title: "Behind the Scenes",
        platform: "Facebook",
        engagement: 850,
        reach: 10000
      },
      {
        title: "Chef's Special",
        platform: "Instagram",
        engagement: 780,
        reach: 9500
      }
    ]
  });

  const timeframeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return Instagram;
      case 'Facebook':
        return Facebook;
      case 'Twitter':
        return Twitter;
      case 'YouTube':
        return Youtube;
      default:
        return Share2;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your social media performance</p>
        </div>
        <div className="flex gap-2">
          {timeframeOptions.map((option) => (
            <Button
              key={option.value}
              variant={timeframe === option.value ? "default" : "outline"}
              onClick={() => setTimeframe(option.value)}
              size="sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Followers</p>
                <h3 className="text-2xl font-bold">{analyticsData.overview.totalFollowers.toLocaleString()}</h3>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>{analyticsData.overview.growthRate}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Engagement</p>
                <h3 className="text-2xl font-bold">{analyticsData.overview.totalEngagement.toLocaleString()}</h3>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <h3 className="text-2xl font-bold">{analyticsData.overview.totalReach.toLocaleString()}</h3>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <h3 className="text-2xl font-bold">{analyticsData.overview.growthRate}%</h3>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Metrics across different social platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.platforms.map((platform) => {
              const Icon = getPlatformIcon(platform.platform);
              return (
                <Card key={platform.platform}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className="h-5 w-5" />
                      <h4 className="font-medium">{platform.platform}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Followers</span>
                        <span className="font-medium">{platform.followers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Engagement</span>
                        <span className="font-medium">{platform.engagement.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Growth</span>
                        <span className="font-medium text-green-600">+{platform.growth}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>Engagement by content type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.content.map((content) => (
                <div key={content.type} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{content.type}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Best time: {content.bestTime}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{content.engagement.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{content.count} posts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Posts with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPosts.map((post, index) => {
                const Icon = getPlatformIcon(post.platform);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground">{post.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{post.engagement.toLocaleString()} engagements</p>
                      <p className="text-sm text-muted-foreground">{post.reach.toLocaleString()} reach</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}