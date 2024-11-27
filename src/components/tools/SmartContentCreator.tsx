import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/useAppStore';
import {
  BookmarkPlus,
  Bot, BrainCircuit,
  Calendar,
  Camera,
  Clock,
  FileText,
  Layers,
  Lightbulb,
  MessageSquare,
  Pencil,
  Plus,
  Share2,
  Sparkles,
  Video,
  Wand2,
  Zap
} from 'lucide-react';
import { useState } from 'react';

interface ContentIdea {
  id: string;
  type: 'photo' | 'video' | 'story' | 'post';
  title: string;
  description: string;
  suggestedCaption?: string;
  hashtags?: string[];
  bestTime?: string;
  estimatedEngagement?: number;
  aiSuggestions?: {
    visualElements?: string[];
    contentAngles?: string[];
    engagementTips?: string[];
  };
  status: 'draft' | 'scheduled' | 'published';
  scheduledFor?: string;
}

interface ContentTemplate {
  id: string;
  name: string;
  type: string;
  structure: string[];
  examples: string[];
  bestPractices: string[];
}

export default function SmartContentCreator() {
  const { isDarkMode } = useAppStore();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [contentIdeas] = useState<ContentIdea[]>([
    {
      id: '1',
      type: 'photo',
      title: 'Behind-the-Scenes Kitchen Action',
      description: 'Showcase our chefs preparing signature dishes',
      suggestedCaption: 'Where the magic happens! 🔥 Our talented chefs crafting your favorite dishes with passion and precision. #BehindTheScenes',
      hashtags: ['#ChefLife', '#RestaurantLife', '#FoodieHeaven'],
      bestTime: '11:30 AM',
      estimatedEngagement: 85,
      aiSuggestions: {
        visualElements: [
          'Action shots of flame cooking',
          'Close-up of plating',
          'Team collaboration moments'
        ],
        contentAngles: [
          'Focus on culinary expertise',
          'Highlight team dynamics',
          'Show attention to detail'
        ],
        engagementTips: [
          'Ask viewers about their favorite dishes',
          'Share a quick kitchen tip',
          'Mention daily specials'
        ]
      },
      status: 'draft'
    }
  ]);

  const [templates] = useState<ContentTemplate[]>([
    {
      id: '1',
      name: 'New Menu Item Launch',
      type: 'photo',
      structure: [
          "Hero shot of the dish",
          "Close-up of key ingredients",
          "Chef's inspiration story",
          "Launch date and price"
      ],
      examples: [
          "Introducing our new summer sensation! 🌟",
          "Created with love, served with pride 👨‍🍳",
          "Available starting [date] - reserve your table now!"
      ],
      bestPractices: [
          "Use natural lighting",
          "Show size perspective",
          "Include garnish details",
          "Add price in comments"
      ]
    }
  ]);

  const contentTypes = [
    {
      id: 'photo',
      icon: Camera,
      title: 'Photo Content',
      description: 'Food photography and visual stories',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'video',
      icon: Video,
      title: 'Video Content',
      description: 'Short-form videos and reels',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'story',
      icon: FileText,
      title: 'Story Content',
      description: 'Engaging narratives and updates',
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'post',
      icon: MessageSquare,
      title: 'Social Posts',
      description: 'Regular updates and announcements',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Assistant Header */}
      <Card className={`border-0 shadow-lg ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 to-background'
          : 'bg-gradient-to-br from-white to-slate-50'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Content Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  Let AI help you create engaging content for your restaurant
                </p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Ideas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentTypes.map(({ id, icon: Icon, title, description, color }) => (
          <Card
            key={id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedType === id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedType(id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Ideas and Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI-Generated Ideas */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Smart Content Ideas
              </CardTitle>
              <CardDescription>
                AI-generated content suggestions based on your restaurant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentIdeas.map((idea) => (
                <Card key={idea.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r ${
                              idea.type === 'photo' ? 'from-pink-500 to-rose-500' :
                              idea.type === 'video' ? 'from-blue-500 to-indigo-500' :
                              idea.type === 'story' ? 'from-purple-500 to-violet-500' :
                              'from-emerald-500 to-teal-500'
                            }`}>
                              {idea.type.charAt(0).toUpperCase() + idea.type.slice(1)}
                            </span>
                            {idea.bestTime && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Best time: {idea.bestTime}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <BookmarkPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <h3 className="font-semibold">{idea.title}</h3>
                        <p className="text-sm text-muted-foreground">{idea.description}</p>

                        {idea.suggestedCaption && (
                          <div className="bg-muted/50 p-3 rounded-lg text-sm">
                            {idea.suggestedCaption}
                          </div>
                        )}

                        {idea.hashtags && (
                          <div className="flex flex-wrap gap-2">
                            {idea.hashtags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {idea.aiSuggestions && (
                          <div className="space-y-2 pt-2">
                            <Separator />
                            <div className="pt-2">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <Bot className="h-4 w-4 text-primary" />
                                AI Suggestions
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                {idea.aiSuggestions.visualElements && (
                                  <div>
                                    <span className="text-xs font-medium">Visual Elements</span>
                                    <ul className="mt-1 text-xs space-y-1 text-muted-foreground">
                                      {idea.aiSuggestions.visualElements.map((elem, i) => (
                                        <li key={i} className="flex items-center gap-1">
                                          <Sparkles className="h-3 w-3 text-primary" />
                                          {elem}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {idea.aiSuggestions.contentAngles && (
                                  <div>
                                    <span className="text-xs font-medium">Content Angles</span>
                                    <ul className="mt-1 text-xs space-y-1 text-muted-foreground">
                                      {idea.aiSuggestions.contentAngles.map((angle, i) => (
                                        <li key={i} className="flex items-center gap-1">
                                          <Sparkles className="h-3 w-3 text-primary" />
                                          {angle}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {idea.aiSuggestions.engagementTips && (
                                  <div>
                                    <span className="text-xs font-medium">Engagement Tips</span>
                                    <ul className="mt-1 text-xs space-y-1 text-muted-foreground">
                                      {idea.aiSuggestions.engagementTips.map((tip, i) => (
                                        <li key={i} className="flex items-center gap-1">
                                          <Sparkles className="h-3 w-3 text-primary" />
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="pt-3 flex items-center justify-between border-t">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Est. Engagement:
                              <span className="text-primary font-medium ml-1">
                                {idea.estimatedEngagement}%
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Templates and Resources */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Content Templates
              </CardTitle>
              <CardDescription>
                Ready-to-use templates for quick content creation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:bg-accent/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {template.type}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium">Structure</span>
                        <ul className="mt-1 text-xs space-y-1 text-muted-foreground">
                          {template.structure.map((item, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button className="w-full mt-2" variant="outline" size="sm">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Template
              </Button>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Post during peak engagement hours
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Use high-quality visuals
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Engage with your audience
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Mix content types for variety
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}