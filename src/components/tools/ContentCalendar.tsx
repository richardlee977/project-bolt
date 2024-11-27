import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Facebook,
  FileText,
  Image,
  Instagram,
  Plus,
  Save,
  Star,
  Twitter,
  X,
  Youtube
} from 'lucide-react';
import { useState } from 'react';

interface ContentPost {
  id: string;
  title: string;
  type: string;
  platforms: string[];
  date: string;
  time: string;
  hashtags: string[];
  mediaType: string[];
  description: string;
  status: string;
}

interface ContentPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  frequency: string;
  themes: string[];
  posts: ContentPost[];
  goals: string[];
}

const steps = [
  {
    title: "Plan Details",
    description: "Basic information",
    icon: FileText
  },
  {
    title: "Content Strategy",
    description: "Themes & goals",
    icon: Star
  },
  {
    title: "Post Planning",
    description: "Create content posts",
    icon: Image
  },
  {
    title: "Schedule",
    description: "Timing & frequency",
    icon: Clock
  }
];

export default function ContentCalendar() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [plans, setPlans] = useState<ContentPlan[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPlan, setCurrentPlan] = useState<ContentPlan>({
    id: Date.now().toString(),
    name: '',
    startDate: '',
    endDate: '',
    frequency: '',
    themes: [],
    posts: [],
    goals: []
  });

  const handleBasicInfoChange = (field: string, value: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThemeToggle = (theme: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const addPost = () => {
    setCurrentPlan(prev => ({
      ...prev,
      posts: [
        ...prev.posts,
        {
          id: Date.now().toString(),
          title: '',
          type: '',
          platforms: [],
          date: '',
          time: '',
          hashtags: [],
          mediaType: [],
          description: '',
          status: 'Draft'
        }
      ]
    }));
  };

  const updatePost = (index: number, field: string, value: string | string[]) => {
    setCurrentPlan(prev => ({
      ...prev,
      posts: prev.posts.map((post, i) =>
        i === index
          ? { ...post, [field]: value }
          : post
      )
    }));
  };

  const removePost = (index: number) => {
    setCurrentPlan(prev => ({
      ...prev,
      posts: prev.posts.filter((_, i) => i !== index)
    }));
  };

  const savePlan = () => {
    if (!currentPlan.name) {
      toast({
        title: "Error",
        description: "Please provide a name for your content plan",
        variant: "destructive"
      });
      return;
    }

    setPlans(prev => [...prev, currentPlan]);
    addTask(`Review content plan: ${currentPlan.name}`);
    toast({
      title: "Success",
      description: "Content plan saved successfully!",
    });

    setCurrentPlan({
      id: Date.now().toString(),
      name: '',
      startDate: '',
      endDate: '',
      frequency: '',
      themes: [],
      posts: [],
      goals: []
    });
    setCurrentStep(1);
  };

  const renderPlanDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Plan Name</label>
        <input
          type="text"
          value={currentPlan.name}
          onChange={(e) => handleBasicInfoChange('name', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Summer Food Festival Campaign"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={currentPlan.startDate}
            onChange={(e) => handleBasicInfoChange('startDate', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="text-sm font-medium">End Date</label>
          <input
            type="date"
            value={currentPlan.endDate}
            onChange={(e) => handleBasicInfoChange('endDate', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Posting Frequency</label>
        <select
          value={currentPlan.frequency}
          onChange={(e) => handleBasicInfoChange('frequency', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select frequency</option>
          <option value="Daily">Daily</option>
          <option value="2-3 times/week">2-3 times per week</option>
          <option value="Weekly">Weekly</option>
          <option value="Bi-weekly">Bi-weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>
    </div>
  );

  const renderContentStrategy = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Content Themes</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Behind the Scenes",
            "Recipe Showcase",
            "Customer Stories",
            "Food Tips",
            "Team Spotlight",
            "Special Offers",
            "Events",
            "Local Community"
          ].map((theme) => (
            <Button
              key={theme}
              variant={currentPlan.themes.includes(theme) ? "default" : "outline"}
              onClick={() => handleThemeToggle(theme)}
              size="sm"
            >
              {theme}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Campaign Goals</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Increase Engagement",
            "Boost Brand Awareness",
            "Drive Website Traffic",
            "Generate Leads",
            "Increase Sales",
            "Build Community",
            "Showcase Products",
            "Educational Content"
          ].map((goal) => (
            <Button
              key={goal}
              variant={currentPlan.goals.includes(goal) ? "default" : "outline"}
              onClick={() => handleGoalToggle(goal)}
              size="sm"
            >
              {goal}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPostPlanning = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Content Posts</h3>
        <Button onClick={addPost} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Post
        </Button>
      </div>
      <div className="space-y-4">
        {currentPlan.posts.map((post, index) => (
          <Card key={post.id}>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => updatePost(index, 'title', e.target.value)}
                  className="flex-1 p-2 border rounded-md mr-2"
                  placeholder="Post title"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removePost(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Content Type</label>
                  <select
                    value={post.type}
                    onChange={(e) => updatePost(index, 'type', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="Photo">Photo</option>
                    <option value="Video">Video</option>
                    <option value="Story">Story</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Reel">Reel</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <select
                    value={post.status}
                    onChange={(e) => updatePost(index, 'status', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready">Ready</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Platforms</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    { name: "Instagram", icon: Instagram },
                    { name: "Facebook", icon: Facebook },
                    { name: "Twitter", icon: Twitter },
                    { name: "YouTube", icon: Youtube }
                  ].map(({ name, icon: Icon }) => (
                    <Button
                      key={name}
                      variant={post.platforms.includes(name) ? "default" : "outline"}
                      onClick={() => updatePost(
                        index,
                        'platforms',
                        post.platforms.includes(name)
                          ? post.platforms.filter(p => p !== name)
                          : [...post.platforms, name]
                      )}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  value={post.description}
                  onChange={(e) => updatePost(index, 'description', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Write your post content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Date</label>
                  <input
                    type="date"
                    value={post.date}
                    onChange={(e) => updatePost(index, 'date', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Time</label>
                  <input
                    type="time"
                    value={post.time}
                    onChange={(e) => updatePost(index, 'time', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">Content Calendar Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPlan.posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{post.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    post.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : post.status === 'Ready'
                      ? 'bg-blue-100 text-blue-800'
                      : post.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{post.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPlanDetails();
      case 2:
        return renderContentStrategy();
      case 3:
        return renderPostPlanning();
      case 4:
        return renderSchedule();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Calendar</CardTitle>
        <CardDescription>Plan and schedule your social media content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Progress value={(currentStep / steps.length) * 100} />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center p-4 rounded-lg text-center ${
                    currentStep === index + 1
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted'
                  }`}
                >
                  <StepIcon className="h-6 w-6 mb-2" />
                  <h3 className="text-sm font-medium">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="min-h-[400px]">
            {getCurrentStepContent()}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            {currentStep === steps.length ? (
              <Button onClick={savePlan}>
                <Save className="h-4 w-4 mr-2" />
                Save Plan
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {plans.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Content Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <Card key={plan.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{plan.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {plan.startDate} - {plan.endDate}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Themes:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plan.themes.slice(0, 3).map((theme, index) => (
                            <span
                              key={index}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {theme}
                            </span>
                          ))}
                          {plan.themes.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{plan.themes.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}