import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, ClipboardList, Instagram, Lightbulb, Star, Store, Target } from 'lucide-react';
import { BusinessStage } from '../types/business';
import EstablishedTools from './stage/EstablishedTools';
import IdeationTools from './stage/IdeationTools';
import PlanningTools from './stage/PlanningTools';
import SocialTools from './stage/SocialTools';

interface Props {
  stage: BusinessStage;
}

const stageComponents = {
  ideation: IdeationTools,
  planning: PlanningTools,
  established: EstablishedTools,
  social: SocialTools,
};

const stageIcons = {
  ideation: Lightbulb,
  planning: ClipboardList,
  established: Store,
  social: Instagram,
};

const stageInfo = {
  ideation: {
    title: "Ideation Stage",
    description: "Explore and validate your restaurant concept",
    progress: 0,
    milestones: [
      "Define concept",
      "Market research",
      "Financial planning",
      "Location analysis"
    ]
  },
  planning: {
    title: "Planning Stage",
    description: "Transform your idea into a solid business plan",
    progress: 0,
    milestones: [
      "Business plan",
      "Funding secured",
      "Location selected",
      "Permits & licenses"
    ]
  },
  established: {
    title: "Established Business",
    description: "Optimize and grow your restaurant",
    progress: 0,
    milestones: [
      "Operations stable",
      "Team trained",
      "Marketing active",
      "Growth planning"
    ]
  },
  social: {
    title: "Social Food Business",
    description: "Build your food brand on social media",
    progress: 0,
    milestones: [
      "Brand identity",
      "Content strategy",
      "Community growth",
      "Monetization"
    ]
  }
};

export default function StageBasedDashboard({ stage }: Props) {
  const { isDarkMode } = useAppStore();
  const StageComponent = stageComponents[stage];
  const StageIcon = stageIcons[stage];
  const { title, description, progress, milestones } = stageInfo[stage];

  return (
    <div className="space-y-6">
      <Card className={`border-0 shadow-lg ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 to-background'
          : 'bg-gradient-to-br from-white to-slate-50'
      }`}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-3 rounded-lg">
              <StageIcon className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <CardTitle className="text-slate-800">{title}</CardTitle>
              <CardDescription className="text-slate-500">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stage Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {milestones.map((milestone, index) => {
                const isCompleted = index * 25 <= progress;
                return (
                  <Card key={index} className={`border ${
                    isCompleted 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'bg-muted/50 border-border'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          isCompleted ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {milestone}
                        </span>
                        {isCompleted && (
                          <Star className="h-4 w-4 text-primary fill-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Next milestone:</span>
                <span className="text-sm font-medium">
                  {milestones[Math.floor(progress / 25)]}
                </span>
              </div>
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                Update Progress
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools Section */}
      <StageComponent />
    </div>
  );
}