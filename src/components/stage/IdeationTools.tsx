import { useState } from 'react';
import { 
  Search, BarChart3,
  Compass, Brain, Palette, Calculator,
  ScrollText, Coins} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import CustomerPersonaBuilder from '../tools/CustomerPersonaBuilder';
import MarketGapAnalyzer from '../tools/MarketGapAnalyzer';
import DemandForecaster from '../tools/DemandForecaster';
import RestaurantConceptBuilder from '../tools/RestaurantConceptBuilder';
import BrandIdentityDesigner from '../tools/BrandIdentityDesigner';
import ConceptValidator from '../tools/ConceptValidator';
import MenuEngineeringTool from '../tools/MenuEngineeringTool';
import RecipeCostCalculator from '../tools/RecipeCostCalculator';
import PriceOptimizer from '../tools/PriceOptimizer';

export default function IdeationTools() {
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
      title: "Market Research & Validation",
      description: "Validate your restaurant concept with data-driven insights",
      tools: [
        {
          id: "market-gap",
          icon: Search,
          title: "Market Gap Analyzer",
          description: "Find untapped opportunities in your area",
          tags: ["Competition Analysis", "Demographics", "Trends"],
          color: "bg-blue-50 hover:bg-blue-100",
          iconColor: "text-blue-600",
          task: "Analyze local market gaps and opportunities",
          component: MarketGapAnalyzer
        },
        {
          id: "demand-forecast",
          icon: BarChart3,
          title: "Demand Forecaster",
          description: "Predict potential customer demand",
          tags: ["Foot Traffic", "Seasonality", "Events"],
          color: "bg-green-50 hover:bg-green-100",
          iconColor: "text-green-600",
          task: "Generate demand forecast report",
          component: DemandForecaster
        },
        // {
        //   id: "customer-persona",
        //   icon: Target,
        //   title: "Customer Persona Builder",
        //   description: "Create detailed customer profiles",
        //   tags: ["Demographics", "Preferences", "Behavior"],
        //   color: "bg-purple-50 hover:bg-purple-100",
        //   iconColor: "text-purple-600",
        //   task: "Define target customer personas",
        //   component: CustomerPersonaBuilder
        // }
      ]
    },
    {
      title: "Concept Development",
      description: "Design and refine your restaurant concept",
      tools: [
        {
          id: "concept-builder",
          icon: Brain,
          title: "Restaurant Concept Builder",
          description: "Define your unique restaurant concept",
          tags: ["Brand Identity", "Theme", "Atmosphere"],
          color: "bg-indigo-50 hover:bg-indigo-100",
          iconColor: "text-indigo-600",
          task: "Develop restaurant concept blueprint",
          component: RestaurantConceptBuilder
        },
        {
          id: "brand-identity",
          icon: Palette,
          title: "Brand Identity Designer",
          description: "Create your restaurant's visual identity",
          tags: ["Logo", "Colors", "Design"],
          color: "bg-pink-50 hover:bg-pink-100",
          iconColor: "text-pink-600",
          task: "Design brand identity elements",
          component: BrandIdentityDesigner
        },
        {
          id: "concept-validator",
          icon: Compass,
          title: "Concept Validator",
          description: "Test and validate your concept",
          tags: ["Focus Groups", "Feedback", "Testing"],
          color: "bg-yellow-50 hover:bg-yellow-100",
          iconColor: "text-yellow-600",
          task: "Run concept validation tests",
          component: ConceptValidator
        }
      ]
    },
    {
      title: "Menu & Pricing Strategy",
      description: "Design your menu and optimize pricing",
      tools: [
        {
          id: "menu-planner",
          icon: ScrollText,
          title: "Menu Engineering Tool",
          description: "Design and optimize your menu offerings",
          tags: ["Menu Items", "Categories", "Layout"],
          color: "bg-orange-50 hover:bg-orange-100",
          iconColor: "text-orange-600",
          task: "Create initial menu draft",
          component: MenuEngineeringTool
        },
        {
          id: "recipe-costing",
          icon: Calculator,
          title: "Recipe Cost Calculator",
          description: "Calculate food costs and pricing",
          tags: ["Ingredients", "Portions", "Margins"],
          color: "bg-emerald-50 hover:bg-emerald-100",
          iconColor: "text-emerald-600",
          task: "Calculate recipe costs",
          component: RecipeCostCalculator
        },
        {
          id: "price-optimizer",
          icon: Coins,
          title: "Price Optimization Tool",
          description: "Set competitive and profitable prices",
          tags: ["Pricing Strategy", "Margins", "Competition"],
          color: "bg-cyan-50 hover:bg-cyan-100",
          iconColor: "text-cyan-600",
          task: "Optimize menu pricing",
          component: PriceOptimizer
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.tools.map((tool, toolIndex) => {
                const Icon = tool.icon;
                return (
                  <Dialog key={toolIndex} open={selectedTool === tool.id} onOpenChange={(open) => !open && setSelectedTool(null)}>
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