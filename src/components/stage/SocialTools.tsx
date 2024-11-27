import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import { Bot, Camera, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import AIAgentsDashboard from '../tools/AIAgentsDashboard';
import AnalyticsDashboard from '../tools/AnalyticsDashboard';
import ContentCalendar from '../tools/ContentCalendar';

export default function SocialTools() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleToolClick = (taskText: string, toasOtText: string, toolId?: string) => {
    addTask(taskText);
    toast({
      title: "Task Added",
      description: toasOtText,
    });
    if (toolId) {
      setSelectedTool(toolId);
    }
  };

  const tools = [
    {
      id: "content-calendar",
      icon: Camera,
      title: "Content Calendar",
      description: "Plan and schedule your content",
      tags: ["Planning", "Scheduling", "Social Media"],
      color: "bg-pink-50 hover:bg-pink-100",
      iconColor: "text-pink-600",
      task: "Create content calendar",
      component: ContentCalendar
    },
    {
      id: "analytics",
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track engagement and growth",
      tags: ["Metrics", "Growth", "Insights"],
      color: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-600",
      task: "Review social analytics",
      component: AnalyticsDashboard
    },
    {
      id: "ai-agents",
      icon: Bot,
      title: "AI Agents",
      description: "Automated social media management",
      tags: ["Automation", "Engagement", "Support"],
      color: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-600",
      task: "Configure AI agents",
      component: AIAgentsDashboard
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Creation</CardTitle>
          <CardDescription>Tools to manage your social media presence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Dialog key={tool.id} open={selectedTool === tool.id} onOpenChange={(open) => !open && setSelectedTool(null)}>
                  <DialogTrigger asChild>
                    <div
                      className={`${tool.color} rounded-lg p-4 transition-all cursor-pointer group`}
                      onClick={() => handleToolClick(
                        tool.task,
                        `Added "${tool.task}" to your tasks`,
                        tool.id
                      )}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${tool.color}`}>
                          <Icon className={`h-5 w-5 ${tool.iconColor}`} />
                        </div>
                        <h4 className="font-semibold">{tool.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`text-xs px-2 py-1 rounded-full 
                              ${tool.color.replace('50', '200')} 
                              ${tool.iconColor.replace('600', '700')}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </DialogTrigger>
                  {tool.component && (
                    <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{tool.title}</DialogTitle>
                        <DialogDescription>{tool.description}</DialogDescription>
                      </DialogHeader>
                      <tool.component />
                    </DialogContent>
                  )}
                </Dialog>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}