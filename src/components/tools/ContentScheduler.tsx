import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Edit2,
  Facebook,
  Instagram,
  MoreHorizontal,
  Plus,
  Twitter
} from 'lucide-react';
import { useState } from 'react';

interface ScheduledPost {
  id: string;
  content: string;
  image?: string;
  platforms: string[];
  date: string;
  time: string;
  status: 'scheduled' | 'published' | 'failed';
  analytics?: {
    impressions: number;
    engagement: number;
  };
}

export default function ContentScheduler() {
  const [scheduledPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      content: "Join us for an amazing brunch this weekend! 🍳",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554",
      platforms: ['instagram', 'facebook'],
      date: '2024-02-24',
      time: '10:00',
      status: 'scheduled',
      analytics: {
        impressions: 1200,
        engagement: 180
      }
    }
  ]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-amber-100 text-amber-700';
      case 'published':
        return 'bg-emerald-100 text-emerald-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'published':
        return <Check className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Content Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Manage your scheduled posts across platforms
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Post
        </Button>
      </div>

      <div className="space-y-4">
        {scheduledPosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {post.image && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={post.image} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                      <div className="flex items-center gap-1">
                        {post.platforms.map((platform) => (
                          <span 
                            key={platform}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-muted"
                          >
                            {getPlatformIcon(platform)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm mb-2">{post.content}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.time}
                    </span>
                  </div>

                  {post.analytics && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Impressions</span>
                        <p className="text-lg font-medium">{post.analytics.impressions}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Engagement</span>
                        <p className="text-lg font-medium">{post.analytics.engagement}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}