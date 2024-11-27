import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

interface VideoCardProps {
  thumbnail: string;
  title: string;
  views: string;
  duration: string;
}

function VideoCard({ thumbnail, title, views, duration }: VideoCardProps) {
  return (
    <Card className="overflow-hidden group">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full object-cover aspect-video"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button size="icon" variant="ghost" className="text-white">
              <Play className="w-12 h-12" fill="white" />
            </Button>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
            {duration}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{views} views</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function YouTubeSection() {
  const videos = [
    {
      thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974",
      title: "How to Price Your Menu for Maximum Profit",
      views: "24K",
      duration: "12:45"
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070",
      title: "Restaurant Marketing Strategies That Actually Work",
      views: "18K",
      duration: "15:20"
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070",
      title: "Opening a Restaurant: Complete Guide",
      views: "32K",
      duration: "20:15"
    }
  ];

  return (
    <div className="bg-muted/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Latest Expert Advice</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stay updated with the latest trends and expert tips
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <VideoCard key={index} {...video} />
          ))}
        </div>
      </div>
    </div>
  );
}