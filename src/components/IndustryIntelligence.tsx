import { useState } from 'react';
import { 
  Newspaper, Lightbulb, TrendingUp, Share2, ExternalLink,
  Filter, BookmarkPlus, ThumbsUp, ThumbsDown, MessageSquare 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: 'trend' | 'opportunity' | 'insight';
  summary: string;
  contentIdea?: string;
  marketingAngle?: string;
  relevanceScore: number;
  url: string;
  isBookmarked?: boolean;
  feedback?: 'helpful' | 'not-helpful';
}

export default function IndustryIntelligence() {
  const { isDarkMode } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: "Plant-Based Foods See 45% Growth in Fine Dining",
      source: "Restaurant Business Weekly",
      category: 'trend',
      summary: "High-end restaurants incorporating more plant-based options are seeing increased customer satisfaction and higher margins.",
      contentIdea: "Behind-the-scenes video of chef creating signature plant-based dish",
      marketingAngle: "Highlight health benefits and sustainability of plant-based menu items",
      relevanceScore: 95,
      url: "#"
    },
    {
      id: '2',
      title: "Local Sourcing Drives Customer Loyalty",
      source: "Food Industry Today",
      category: 'insight',
      summary: "Restaurants featuring locally sourced ingredients see 30% higher customer return rates.",
      contentIdea: "Photo series featuring local farmers and suppliers",
      marketingAngle: "Create farm-to-table storytelling campaign",
      relevanceScore: 88,
      url: "#"
    },
    {
      id: '3',
      title: "AI-Powered Menu Optimization Trends",
      source: "Tech in Restaurants",
      category: 'opportunity',
      summary: "Restaurants using AI for menu planning report 25% reduction in food waste.",
      contentIdea: "Timelapse video showing kitchen efficiency improvements",
      marketingAngle: "Emphasize sustainability efforts and modern approach",
      relevanceScore: 92,
      url: "#"
    }
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'opportunity':
        return <Lightbulb className="h-4 w-4" />;
      case 'insight':
        return <Share2 className="h-4 w-4" />;
      default:
        return <Newspaper className="h-4 w-4" />;
    }
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'trend':
        return 'from-cyan-500 to-blue-500';
      case 'opportunity':
        return 'from-emerald-500 to-teal-500';
      case 'insight':
        return 'from-violet-500 to-purple-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const handleBookmark = (itemId: string) => {
    setNewsItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isBookmarked: !item.isBookmarked }
        : item
    ));
  };

  const handleFeedback = (itemId: string, type: 'helpful' | 'not-helpful') => {
    setNewsItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, feedback: type }
        : item
    ));
  };

  const filteredItems = selectedCategory 
    ? newsItems.filter(item => item.category === selectedCategory)
    : newsItems;

  return (
    <Card className={`border-0 shadow-lg ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 to-background'
        : 'bg-gradient-to-br from-white to-slate-50'
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Industry Intelligence
            </CardTitle>
            <CardDescription>
              AI-curated insights and content ideas for your business
            </CardDescription>
          </div>
        </div>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={!selectedCategory ? 'bg-primary/10' : ''}
            >
              <Filter className="h-2 w-2 mr-2" />
              All
            </Button>
            {['trend', 'opportunity', 'insight'].map(category => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-primary/10' : ''}
              >
                {getCategoryIcon(category)}
                <span className="ml-2 capitalize">{category}</span>
              </Button>
            ))}
          </div>
      </CardHeader> 
      <CardContent className="space-y-4">
        {filteredItems.map((item) => (
          <Card 
            key={item.id} 
            className={`overflow-hidden border-0 shadow transition-all duration-200 ${
              item.isBookmarked ? 'ring-2 ring-primary/20' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r ${getCategoryStyle(item.category)} flex items-center gap-1`}>
                        {getCategoryIcon(item.category)}
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleBookmark(item.id)}
                      >
                        <BookmarkPlus className={`h-4 w-4 ${
                          item.isBookmarked ? 'fill-primary text-primary' : ''
                        }`} />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.summary}</p>

                  <div className="pt-2 space-y-2">
                    {item.contentIdea && (
                      <div className="flex items-start gap-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-primary mt-1" />
                        <span><strong>Content Idea:</strong> {item.contentIdea}</span>
                      </div>
                    )}
                    {item.marketingAngle && (
                      <div className="flex items-start gap-2 text-sm">
                        <Share2 className="h-4 w-4 text-primary mt-1" />
                        <span><strong>Marketing Angle:</strong> {item.marketingAngle}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Was this helpful?</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          item.feedback === 'helpful' ? 'text-primary' : ''
                        }`}
                        onClick={() => handleFeedback(item.id, 'helpful')}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          item.feedback === 'not-helpful' ? 'text-primary' : ''
                        }`}
                        onClick={() => handleFeedback(item.id, 'not-helpful')}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Discuss
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Read more</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
          View All Insights
        </Button> */}
      </CardContent>
    </Card>
  );
}