import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { Facebook, Instagram, Twitter } from 'lucide-react';

interface PreviewProps {
  platform: 'instagram' | 'facebook' | 'twitter';
  content: {
    image?: string;
    caption: string;
    hashtags: string[];
  };
}

export default function ContentPreview({ platform, content }: PreviewProps) {
  const { isDarkMode } = useAppStore();

  const getPlatformIcon = () => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
    }
  };

  const getPlatformStyle = () => {
    switch (platform) {
      case 'instagram':
        return 'from-pink-500 to-purple-500';
      case 'facebook':
        return 'from-blue-600 to-blue-700';
      case 'twitter':
        return 'from-sky-400 to-sky-500';
    }
  };

  return (
    <Card className={`overflow-hidden border-0 ${
      isDarkMode ? 'bg-background' : 'bg-white'
    }`}>
      <div className={`p-3 bg-gradient-to-r ${getPlatformStyle()} text-white flex items-center gap-2`}>
        {getPlatformIcon()}
        <span className="font-medium capitalize">{platform} Preview</span>
      </div>
      <CardContent className="p-4">
        {content.image && (
          <div className="aspect-square rounded-lg overflow-hidden mb-4">
            <img 
              src={content.image} 
              alt="Post preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="space-y-2">
          <p className="text-sm whitespace-pre-wrap">{content.caption}</p>
          <div className="flex flex-wrap gap-1">
            {content.hashtags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}