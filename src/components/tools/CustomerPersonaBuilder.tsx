import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  Save,
  Target,
  User,
  Utensils,
  X
} from 'lucide-react';
import { useState } from 'react';


interface Persona {
  id: string;
  name?: string;
  age?: string;
  occupation?: string;
  income?: string;
  location?: string;
  diningBehavior: {
    visitFrequency?: string;
    averageSpend?: string;
    preferredTimes?: string[];
    groupSize?: string;
  };
  marketingPreferences: {
    channels?: string[];
    promotionTypes?: string[];
    loyaltyPreference?: string;
  };
  attributes: {
    [key: string]: {
      label?: string;
      options?: string[];
      selected?: string[];
    };
  };
  competitorInsights: string[];
}

const steps = [
  {
    title: "Basic Info",
    description: "Personal details",
    icon: User
  },
  {
    title: "Dining Habits",
    description: "Preferences & behavior",
    icon: Utensils
  },
  {
    title: "Preferences",
    description: "Dietary & service needs",
    icon: Heart
  },
  {
    title: "Marketing",
    description: "Channel preferences",
    icon: Target
  },
  {
    title: "Competition",
    description: "Market insights",
    icon: Briefcase
  }
];

export default function CustomerPersonaBuilder() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPersona, setCurrentPersona] = useState<Partial<Persona>>({
    id: Date.now().toString(),
    diningBehavior: {
      visitFrequency: '',
      averageSpend: '',
      preferredTimes: [],
      groupSize: ''
    },
    marketingPreferences: {
      channels: [],
      promotionTypes: [],
      loyaltyPreference: ''
    },
    attributes: {
      cuisinePreferences: {
        label: "Cuisine Preferences",
        options: ["Asian Fusion", "Italian", "American", "Mexican", "Japanese", "Mediterranean", "Indian", "Thai"],
        selected: []
      },
      diningMotivations: {
        label: "Dining Motivations",
        options: ["Quick Meals", "Social Gatherings", "Special Occasions", "Business Meetings", "Family Time"],
        selected: []
      },
      dietaryPreferences: {
        label: "Dietary Preferences",
        options: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Halal", "Organic", "Low-Carb"],
        selected: []
      },
      serviceExpectations: {
        label: "Service Expectations",
        options: ["Quick Service", "Fine Dining", "Casual", "Self-Service", "Delivery"],
        selected: []
      },
      painPoints: {
        label: "Pain Points",
        options: ["Wait Times", "Price", "Parking", "Food Quality", "Service Speed", "Menu Variety"],
        selected: []
      },
      lifestyle: {
        label: "Lifestyle",
        options: ["Health-Conscious", "Foodie", "Busy Professional", "Family-Oriented", "Social", "Budget-Minded"],
        selected: []
      }
    },
    competitorInsights: []
  });

  const handleBasicInfoChange = (field: string, value: string) => {
    setCurrentPersona(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiningBehaviorChange = (field: string, value: string) => {
    setCurrentPersona(prev => ({
      ...prev,
      diningBehavior: {
        ...prev.diningBehavior,
        [field]: value
      }
    }));
  };

  const handlePreferredTimeToggle = (time: string) => {
    setCurrentPersona(prev => ({
      ...prev,
      diningBehavior: {
        ...prev.diningBehavior,
        preferredTimes: prev.diningBehavior?.preferredTimes?.includes(time)
          ? prev.diningBehavior.preferredTimes.filter(t => t !== time)
          : [...(prev.diningBehavior?.preferredTimes || []), time]
      }
    }));
  };

  // const handleAttributeToggle = (category: keyof typeof currentPersona.attributes, option: string) => {
  //   setCurrentPersona(prev => ({
  //     ...prev,
  //     attributes: {
  //       ...(prev.attributes || {}), // Ensure attributes is an object
  //       [category]: {
  //         ...(prev.attributes?.[category] || { selected: [] }), // Default category with empty selected array if undefined
  //         selected: (prev.attributes?.[category]?.selected ?? []).includes(option)
  //           ? prev.attributes[category].selected.filter(o => o !== option)
  //           : [...prev.attributes[category].selected(), option]
  //       }
  //     }
  //   }));
  // };

  const handleMarketingChannelToggle = (channel: string) => {
    setCurrentPersona(prev => ({
      ...prev,
      marketingPreferences: {
        ...prev.marketingPreferences,
        channels: prev.marketingPreferences?.channels?.includes(channel)
          ? prev.marketingPreferences.channels.filter(c => c !== channel)
          : [...(prev.marketingPreferences?.channels || []), channel]
      }
    }));
  };

  const handlePromotionTypeToggle = (type: string) => {
    setCurrentPersona(prev => ({
      ...prev,
      marketingPreferences: {
        ...prev.marketingPreferences,
        promotionTypes: prev.marketingPreferences?.promotionTypes?.includes(type)
          ? prev.marketingPreferences.promotionTypes.filter(t => t !== type)
          : [...(prev.marketingPreferences?.promotionTypes || []), type]
      }
    }));
  };

  const addCompetitorInsight = () => {
    setCurrentPersona(prev => ({
      ...prev,
      competitorInsights: [...(prev.competitorInsights || []), '']
    }));
  };

  const removeCompetitorInsight = (index: number) => {
    setCurrentPersona(prev => ({
      ...prev,
      competitorInsights: prev.competitorInsights?.filter((_, i) => i !== index)
    }));
  };

  const handleCompetitorInsightChange = (index: number, value: string) => {
    setCurrentPersona(prev => ({
      ...prev,
      competitorInsights: prev.competitorInsights?.map((insight, i) =>
        i === index ? value : insight
      )
    }));
  };

  const savePersona = () => {
    if (!currentPersona.name) {
      toast({
        title: "Error",
        description: "Please provide a name for the persona",
        variant: "destructive"
      });
      return;
    }

    setPersonas(prev => [...prev, currentPersona as Persona]);
    addTask(`Review customer persona: ${currentPersona.name}`);
    toast({
      title: "Success",
      description: "Customer persona saved successfully!",
    });

    // Reset form
    setCurrentPersona({
      id: Date.now().toString(),
      diningBehavior: {
        visitFrequency: '',
        averageSpend: '',
        preferredTimes: [],
        groupSize: ''
      },
      marketingPreferences: {
        channels: [],
        promotionTypes: [],
        loyaltyPreference: ''
      },
      attributes: {
        cuisinePreferences: {
          label: "Cuisine Preferences",
          options: ["Asian Fusion", "Italian", "American", "Mexican", "Japanese", "Mediterranean", "Indian", "Thai"],
          selected: []
        },
        diningMotivations: {
          label: "Dining Motivations",
          options: ["Quick Meals", "Social Gatherings", "Special Occasions", "Business Meetings", "Family Time"],
          selected: []
        },
        dietaryPreferences: {
          label: "Dietary Preferences",
          options: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Halal", "Organic", "Low-Carb"],
          selected: []
        },
        serviceExpectations: {
          label: "Service Expectations",
          options: ["Quick Service", "Fine Dining", "Casual", "Self-Service", "Delivery"],
          selected: []
        },
        painPoints: {
          label: "Pain Points",
          options: ["Wait Times", "Price", "Parking", "Food Quality", "Service Speed", "Menu Variety"],
          selected: []
        },
        lifestyle: {
          label: "Lifestyle",
          options: ["Health-Conscious", "Foodie", "Busy Professional", "Family-Oriented", "Social", "Budget-Minded"],
          selected: []
        }
      },
      competitorInsights: []
    });
    setCurrentStep(1);
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          value={currentPersona.name || ''}
          onChange={(e) => handleBasicInfoChange('name', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Young Professional Sarah"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Age Range</label>
        <select
          value={currentPersona.age || ''}
          onChange={(e) => handleBasicInfoChange('age', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select age range</option>
          <option value="18-24">18-24</option>
          <option value="25-34">25-34</option>
          <option value="35-44">35-44</option>
          <option value="45-54">45-54</option>
          <option value="55+">55+</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Occupation</label>
        <input
          type="text"
          value={currentPersona.occupation || ''}
          onChange={(e) => handleBasicInfoChange('occupation', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Software Engineer"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Income Range</label>
        <select
          value={currentPersona.income || ''}
          onChange={(e) => handleBasicInfoChange('income', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select income range</option>
          <option value="Under $30k">Under $30k</option>
          <option value="$30k-$50k">$30k-$50k</option>
          <option value="$50k-$75k">$50k-$75k</option>
          <option value="$75k-$100k">$75k-$100k</option>
          <option value="$100k+">$100k+</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Location</label>
        <input
          type="text"
          value={currentPersona.location || ''}
          onChange={(e) => handleBasicInfoChange('location', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Downtown Area"
        />
      </div>
    </div>
  );

  const renderDiningBehavior = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Visit Frequency</label>
        <select
          value={currentPersona.diningBehavior?.visitFrequency || ''}
          onChange={(e) => handleDiningBehaviorChange('visitFrequency', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select frequency</option>
          <option value="Daily">Daily</option>
          <option value="2-3 times a week">2-3 times a week</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Occasionally">Occasionally</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Average Spend per Visit</label>
        <select
          value={currentPersona.diningBehavior?.averageSpend || ''}
          onChange={(e) => handleDiningBehaviorChange('averageSpend', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select average spend</option>
          <option value="Under $15">Under $15</option>
          <option value="$15-$30">$15-$30</option>
          <option value="$30-$50">$30-$50</option>
          <option value="$50-$100">$50-$100</option>
          <option value="$100+">$100+</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Preferred Times</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {["Breakfast", "Lunch", "Dinner", "Late Night"].map((time) => (
            <Button
              key={time}
              variant={currentPersona.diningBehavior?.preferredTimes?.includes(time) ? "default" : "outline"}
              onClick={() => handlePreferredTimeToggle(time)}
              size="sm"
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Typical Group Size</label>
        <select
          value={currentPersona.diningBehavior?.groupSize || ''}
          onChange={(e) => handleDiningBehaviorChange('groupSize', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select group size</option>
          <option value="Solo">Solo</option>
          <option value="Couple">Couple</option>
          <option value="Small Group (3-4)">Small Group (3-4)</option>
          <option value="Medium Group (5-8)">Medium Group (5-8)</option>
          <option value="Large Group (8+)">Large Group (8+)</option>
        </select>
      </div>
    </div>
  );

  const renderMarketingPreferences = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Preferred Marketing Channels</h3>
        <div className="flex flex-wrap gap-2">
          {["Email", "SMS", "Social Media", "Push Notifications", "Print Media"].map((channel) => (
            <Button
              key={channel}
              variant={currentPersona.marketingPreferences?.channels?.includes(channel) ? "default" : "outline"}
              onClick={() => handleMarketingChannelToggle(channel)}
              size="sm"
            >
              {channel}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-3">Preferred Promotion Types</h3>
        <div className="flex flex-wrap gap-2">
          {["Discounts", "BOGO", "Points", "Free Items", "Early Access", "Special Events"].map((type) => (
            <Button
              key={type}
              variant={currentPersona.marketingPreferences?.promotionTypes?.includes(type) ? "default" : "outline"}
              onClick={() => handlePromotionTypeToggle(type)}
              size="sm"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompetitorInsights = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Competitor Insights</h3>
        <Button onClick={addCompetitorInsight} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Insight
        </Button>
      </div>
      {currentPersona.competitorInsights?.map((insight, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={insight}
            onChange={(e) => handleCompetitorInsightChange(index, e.target.value)}
            className="flex-1 p-2 border rounded-md"
            placeholder="e.g., Prefers competitor X for their quick service"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeCompetitorInsight(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );

  // const renderAttributes = (category: keyof typeof currentPersona.attributes) => {
  //   const attribute = currentPersona.attributes[category];
  //   return (
  //     <div className="space-y-4">
  //       <h3 className="font-medium">{attribute.label}</h3>
  //       <div className="flex flex-wrap gap-2">
  //         {attribute.options.map((option) => (
  //           <Button
  //             key={option}
  //             variant={attribute.selected.includes(option) ? "default" : "outline"}
  //             onClick={() => handleAttributeToggle(category, option)}
  //             size="sm"
  //           >
  //             {option}
  //           </Button>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return (
          <div className="space-y-6">
            {renderDiningBehavior()}
            {/* {renderAttributes('cuisinePreferences')} */}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {/* {renderAttributes('dietaryPreferences')}
            {renderAttributes('serviceExpectations')} */}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            {renderMarketingPreferences()}
            {/* {renderAttributes('lifestyle')} */}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            {/* {renderAttributes('painPoints')} */}
            {renderCompetitorInsights()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Persona Builder</CardTitle>
        <CardDescription>Create detailed profiles of your target customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Progress value={(currentStep / steps.length) * 100} />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
              <Button onClick={savePersona}>
                <Save className="h-4 w-4 mr-2" />
                Save Persona
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {personas.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Personas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personas.map((persona) => (
                  <Card key={persona.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{persona.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {persona.age} • {persona.occupation}
                      </p>
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