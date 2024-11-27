import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  ChevronLeft,
  ChevronRight,
  Map,
  Plus,
  Save,
  Store,
  Target,
  TrendingUp,
  X
} from 'lucide-react';
import { useState } from 'react';

interface MarketAnalysis {
  id: string;
  location: {
    area: string;
    population: string;
    income: string;
    competition: string[];
  };
  demographics: {
    ageGroups: string[];
    occupations: string[];
    lifestyles: string[];
  };
  competition: {
    directCompetitors: {
      name: string;
      type: string;
      strengths: string[];
      weaknesses: string[];
    }[];
    indirectCompetitors: string[];
  };
  opportunities: {
    gaps: string[];
    trends: string[];
    uniqueValue: string;
  };
  demand: {
    peakHours: string[];
    seasonality: string[];
    events: string[];
  };
}

const steps = [
  {
    title: "Location Analysis",
    description: "Area demographics",
    icon: Map
  },
  {
    title: "Competition",
    description: "Competitor analysis",
    icon: Store
  },
  {
    title: "Market Gaps",
    description: "Opportunity identification",
    icon: Target
  },
  {
    title: "Demand Analysis",
    description: "Customer demand patterns",
    icon: TrendingUp
  }
];

export default function MarketGapAnalyzer() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [analyses, setAnalyses] = useState<MarketAnalysis[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentAnalysis, setCurrentAnalysis] = useState<MarketAnalysis>({
    id: Date.now().toString(),
    location: {
      area: '',
      population: '',
      income: '',
      competition: []
    },
    demographics: {
      ageGroups: [],
      occupations: [],
      lifestyles: []
    },
    competition: {
      directCompetitors: [],
      indirectCompetitors: []
    },
    opportunities: {
      gaps: [],
      trends: [],
      uniqueValue: ''
    },
    demand: {
      peakHours: [],
      seasonality: [],
      events: []
    }
  });

  const handleLocationChange = (field: string, value: string) => {
    setCurrentAnalysis(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleDemographicToggle = (category: keyof typeof currentAnalysis.demographics, value: string) => {
    setCurrentAnalysis(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [category]: prev.demographics[category].includes(value)
          ? prev.demographics[category].filter(item => item !== value)
          : [...prev.demographics[category], value]
      }
    }));
  };

  const addCompetitor = (type: 'direct' | 'indirect') => {
    if (type === 'direct') {
      setCurrentAnalysis(prev => ({
        ...prev,
        competition: {
          ...prev.competition,
          directCompetitors: [
            ...prev.competition.directCompetitors,
            { name: '', type: '', strengths: [], weaknesses: [] }
          ]
        }
      }));
    } else {
      setCurrentAnalysis(prev => ({
        ...prev,
        competition: {
          ...prev.competition,
          indirectCompetitors: [...prev.competition.indirectCompetitors, '']
        }
      }));
    }
  };

  const updateCompetitor = (index: number, field: string, value: string | string[]) => {
    setCurrentAnalysis(prev => ({
      ...prev,
      competition: {
        ...prev.competition,
        directCompetitors: prev.competition.directCompetitors.map((comp, i) =>
          i === index ? { ...comp, [field]: value } : comp
        )
      }
    }));
  };

  const removeCompetitor = (type: 'direct' | 'indirect', index: number) => {
    setCurrentAnalysis(prev => ({
      ...prev,
      competition: {
        ...prev.competition,
        [type === 'direct' ? 'directCompetitors' : 'indirectCompetitors']:
          type === 'direct'
            ? prev.competition.directCompetitors.filter((_, i) => i !== index)
            : prev.competition.indirectCompetitors.filter((_, i) => i !== index)
      }
    }));
  };

  const handleOpportunityChange = (field: keyof typeof currentAnalysis.opportunities, value: string | string[]) => {
    setCurrentAnalysis(prev => ({
      ...prev,
      opportunities: {
        ...prev.opportunities,
        [field]: value
      }
    }));
  };

  const handleDemandToggle = (category: keyof typeof currentAnalysis.demand, value: string) => {
    setCurrentAnalysis(prev => ({
      ...prev,
      demand: {
        ...prev.demand,
        [category]: prev.demand[category].includes(value)
          ? prev.demand[category].filter(item => item !== value)
          : [...prev.demand[category], value]
      }
    }));
  };

  const saveAnalysis = () => {
    if (!currentAnalysis.location.area) {
      toast({
        title: "Error",
        description: "Please provide a location area for the analysis",
        variant: "destructive"
      });
      return;
    }

    setAnalyses(prev => [...prev, currentAnalysis]);
    addTask(`Review market analysis for ${currentAnalysis.location.area}`);
    toast({
      title: "Success",
      description: "Market analysis saved successfully!",
    });

    // Reset form
    setCurrentAnalysis({
      id: Date.now().toString(),
      location: {
        area: '',
        population: '',
        income: '',
        competition: []
      },
      demographics: {
        ageGroups: [],
        occupations: [],
        lifestyles: []
      },
      competition: {
        directCompetitors: [],
        indirectCompetitors: []
      },
      opportunities: {
        gaps: [],
        trends: [],
        uniqueValue: ''
      },
      demand: {
        peakHours: [],
        seasonality: [],
        events: []
      }
    });
    setCurrentStep(1);
  };

  const renderLocationAnalysis = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Target Area</label>
        <input
          type="text"
          value={currentAnalysis.location.area}
          onChange={(e) => handleLocationChange('area', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Downtown Business District"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Population Density</label>
        <select
          value={currentAnalysis.location.population}
          onChange={(e) => handleLocationChange('population', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select density</option>
          <option value="High">High Density</option>
          <option value="Medium">Medium Density</option>
          <option value="Low">Low Density</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Average Income Level</label>
        <select
          value={currentAnalysis.location.income}
          onChange={(e) => handleLocationChange('income', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select income level</option>
          <option value="High">High Income</option>
          <option value="Medium">Medium Income</option>
          <option value="Low">Low Income</option>
        </select>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Target Demographics</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Age Groups</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {["18-24", "25-34", "35-44", "45-54", "55+"].map((age) => (
                <Button
                  key={age}
                  variant={currentAnalysis.demographics.ageGroups.includes(age) ? "default" : "outline"}
                  onClick={() => handleDemographicToggle('ageGroups', age)}
                  size="sm"
                >
                  {age}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Primary Occupations</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {["Students", "Professionals", "Entrepreneurs", "Service Workers", "Retirees"].map((occupation) => (
                <Button
                  key={occupation}
                  variant={currentAnalysis.demographics.occupations.includes(occupation) ? "default" : "outline"}
                  onClick={() => handleDemographicToggle('occupations', occupation)}
                  size="sm"
                >
                  {occupation}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompetitionAnalysis = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Direct Competitors</h3>
          <Button onClick={() => addCompetitor('direct')} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Competitor
          </Button>
        </div>
        <div className="space-y-4">
          {currentAnalysis.competition.directCompetitors.map((competitor, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={competitor.name}
                  onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                  className="flex-1 p-2 border rounded-md mr-2"
                  placeholder="Competitor name"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeCompetitor('direct', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <select
                value={competitor.type}
                onChange={(e) => updateCompetitor(index, 'type', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select type</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Cafe">Cafe</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Food Truck">Food Truck</option>
              </select>
              <div>
                <label className="text-sm text-gray-600">Strengths</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["Location", "Price", "Quality", "Service", "Ambiance"].map((strength) => (
                    <Button
                      key={strength}
                      variant={competitor.strengths.includes(strength) ? "default" : "outline"}
                      onClick={() => updateCompetitor(
                        index,
                        'strengths',
                        competitor.strengths.includes(strength)
                          ? competitor.strengths.filter(s => s !== strength)
                          : [...competitor.strengths, strength]
                      )}
                      size="sm"
                    >
                      {strength}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Weaknesses</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["Limited Menu", "High Prices", "Poor Service", "Location", "Hours"].map((weakness) => (
                    <Button
                      key={weakness}
                      variant={competitor.weaknesses.includes(weakness) ? "default" : "outline"}
                      onClick={() => updateCompetitor(
                        index,
                        'weaknesses',
                        competitor.weaknesses.includes(weakness)
                          ? competitor.weaknesses.filter(w => w !== weakness)
                          : [...competitor.weaknesses, weakness]
                      )}
                      size="sm"
                    >
                      {weakness}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOpportunityAnalysis = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Market Gaps</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Healthy Options",
            "Late Night Dining",
            "Family-Friendly",
            "Quick Service",
            "Premium Experience",
            "Authentic Cuisine",
            "Dietary Restrictions",
            "Value Meals"
          ].map((gap) => (
            <Button
              key={gap}
              variant={currentAnalysis.opportunities.gaps.includes(gap) ? "default" : "outline"}
              onClick={() => handleOpportunityChange(
                'gaps',
                currentAnalysis.opportunities.gaps.includes(gap)
                  ? currentAnalysis.opportunities.gaps.filter(g => g !== gap)
                  : [...currentAnalysis.opportunities.gaps, gap]
              )}
              size="sm"
            >
              {gap}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-3">Current Trends</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Plant-Based",
            "Global Fusion",
            "Health-Conscious",
            "Instagram-Worthy",
            "Sustainable",
            "Local Sourcing",
            "Ghost Kitchen",
            "Experience Dining"
          ].map((trend) => (
            <Button
              key={trend}
              variant={currentAnalysis.opportunities.trends.includes(trend) ? "default" : "outline"}
              onClick={() => handleOpportunityChange(
                'trends',
                currentAnalysis.opportunities.trends.includes(trend)
                  ? currentAnalysis.opportunities.trends.filter(t => t !== trend)
                  : [...currentAnalysis.opportunities.trends, trend]
              )}
              size="sm"
            >
              {trend}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Unique Value Proposition</label>
        <textarea
          value={currentAnalysis.opportunities.uniqueValue}
          onChange={(e) => handleOpportunityChange('uniqueValue', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          rows={4}
          placeholder="Describe your unique advantage in the market..."
        />
      </div>
    </div>
  );

  const renderDemandAnalysis = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Peak Hours</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Early Morning (6-9)",
            "Morning (9-11)",
            "Lunch (11-2)",
            "Afternoon (2-5)",
            "Dinner (5-8)",
            "Late Night (8-12)"
          ].map((time) => (
            <Button
              key={time}
              variant={currentAnalysis.demand.peakHours.includes(time) ? "default" : "outline"}
              onClick={() => handleDemandToggle('peakHours', time)}
              size="sm"
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-3">Seasonality</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Summer Peak",
            "Winter Peak",
            "Holiday Season",
            "School Season",
            "Tourist Season",
            "Year-Round"
          ].map((season) => (
            <Button
              key={season}
              variant={currentAnalysis.demand.seasonality.includes(season) ? "default" : "outline"}
              onClick={() => handleDemandToggle('seasonality', season)}
              size="sm"
            >
              {season}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-3">Local Events Impact</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Sports Events",
            "Festivals",
            "Conventions",
            "Business District",
            "Shopping Season",
            "Cultural Events"
          ].map((event) => (
            <Button
              key={event}
              variant={currentAnalysis.demand.events.includes(event) ? "default" : "outline"}
              onClick={() => handleDemandToggle('events', event)}
              size="sm"
            >
              {event}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderLocationAnalysis();
      case 2:
        return renderCompetitionAnalysis();
      case 3:
        return renderOpportunityAnalysis();
      case 4:
        return renderDemandAnalysis();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Gap Analyzer</CardTitle>
        <CardDescription>Analyze your market to identify opportunities</CardDescription>
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
              <Button onClick={saveAnalysis}>
                <Save className="h-4 w-4 mr-2" />
                Save Analysis
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {analyses.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Analyses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyses.map((analysis) => (
                  <Card key={analysis.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{analysis.location.area}</h4>
                      <p className="text-sm text-muted-foreground">
                        {analysis.location.population} Population • {analysis.location.income} Income
                      </p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Identified Gaps:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.opportunities.gaps.slice(0, 3).map((gap, index) => (
                            <span
                              key={index}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {gap}
                            </span>
                          ))}
                          {analysis.opportunities.gaps.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{analysis.opportunities.gaps.length - 3} more
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