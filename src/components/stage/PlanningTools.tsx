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
import { Calendar, Map, ShoppingBag, Users } from 'lucide-react';
import { useState } from 'react';
import EquipmentGuide from '../tools/EquipmentGuide';
import LocationAnalyzer from '../tools/LocationAnalyzer';
import StaffPlanner from '../tools/StaffPlanner';

export default function PlanningTools() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleToolClick = (taskText: string, toastText: string, toolId?: string) => {
    addTask(taskText);
    toast({
      title: "Task Added",
      description: toastText,
    });
    if (toolId) {
      setSelectedTool(toolId);
    }
  };

  const toolSections = [
    {
      title: "Business Setup",
      description: "Essential planning tools for your restaurant",
      tools: [
        {
          id: "staff-planner",
          icon: Users,
          title: "Staff Planner",
          description: "Plan and manage your restaurant staff",
          tags: ["Roles", "Scheduling", "Budget"],
          color: "bg-blue-50 hover:bg-blue-100",
          iconColor: "text-blue-600",
          task: "Create staff planning schedule",
          component: StaffPlanner
        },
        {
          id: "location-analyzer",
          icon: Map,
          title: "Location Analyzer",
          description: "Find & evaluate locations",
          tags: ["Demographics", "Traffic", "Competition"],
          color: "bg-green-50 hover:bg-green-100",
          iconColor: "text-green-600",
          task: "Analyze potential locations",
          component: LocationAnalyzer
        }
      ]
    },
    {
      title: "Operations Planning",
      description: "Tools for smooth restaurant operations",
      tools: [
        {
          id: "equipment-guide",
          icon: ShoppingBag,
          title: "Equipment Guide",
          description: "Essential equipment planning",
          tags: ["Kitchen", "Front-of-house", "Technology"],
          color: "bg-purple-50 hover:bg-purple-100",
          iconColor: "text-purple-600",
          task: "Plan equipment requirements",
          component: EquipmentGuide
        },
        {
          id: "timeline-builder",
          icon: Calendar,
          title: "Timeline Builder",
          description: "Create opening timeline",
          tags: ["Milestones", "Tasks", "Deadlines"],
          color: "bg-orange-50 hover:bg-orange-100",
          iconColor: "text-orange-600",
          task: "Create opening timeline"
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {toolSections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.tools.map((tool) => {
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
      ))}
    </div>
  );
}