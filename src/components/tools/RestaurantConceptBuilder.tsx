import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Lightbulb,
  Palette,
  Save,
  Store, Users
} from 'lucide-react';
import { useState } from 'react';

interface RestaurantConcept {
  id: string;
  name: string;
  conceptType: string;
  vision: {
    missionStatement: string;
    coreValues: string[];
    targetEmotion: string[];
  };
  atmosphere: {
    style: string[];
    lighting: string[];
    music: string[];
    seating: string[];
  };
  serviceStyle: {
    type: string;
    interactions: string[];
    specialFeatures: string[];
  };
  brandIdentity: {
    colors: string[];
    personality: string[];
    story: string;
  };
  uniqueFeatures: string[];
}

const steps = [
  {
    title: "Basic Concept",
    description: "Core restaurant idea",
    icon: Lightbulb
  },
  {
    title: "Vision & Values",
    description: "Mission and values",
    icon: Heart
  },
  {
    title: "Atmosphere",
    description: "Look and feel",
    icon: Store
  },
  {
    title: "Service Style",
    description: "Customer experience",
    icon: Users
  },
  {
    title: "Brand Identity",
    description: "Visual elements",
    icon: Palette
  }
];

export default function RestaurantConceptBuilder() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [concepts, setConcepts] = useState<RestaurantConcept[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentConcept, setCurrentConcept] = useState<RestaurantConcept>({
    id: Date.now().toString(),
    name: '',
    conceptType: '',
    vision: {
      missionStatement: '',
      coreValues: [],
      targetEmotion: []
    },
    atmosphere: {
      style: [],
      lighting: [],
      music: [],
      seating: []
    },
    serviceStyle: {
      type: '',
      interactions: [],
      specialFeatures: []
    },
    brandIdentity: {
      colors: [],
      personality: [],
      story: ''
    },
    uniqueFeatures: []
  });

  const handleBasicInfoChange = (field: string, value: string) => {
    setCurrentConcept(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVisionChange = (field: keyof typeof currentConcept.vision, value: string | string[]) => {
    setCurrentConcept(prev => ({
      ...prev,
      vision: {
        ...prev.vision,
        [field]: value
      }
    }));
  };

  const handleAtmosphereToggle = (category: keyof typeof currentConcept.atmosphere, value: string) => {
    setCurrentConcept(prev => ({
      ...prev,
      atmosphere: {
        ...prev.atmosphere,
        [category]: prev.atmosphere[category].includes(value)
          ? prev.atmosphere[category].filter(item => item !== value)
          : [...prev.atmosphere[category], value]
      }
    }));
  };

  const handleServiceStyleChange = (field: keyof typeof currentConcept.serviceStyle, value: string | string[]) => {
    setCurrentConcept(prev => ({
      ...prev,
      serviceStyle: {
        ...prev.serviceStyle,
        [field]: typeof value === 'string' ? value : 
          Array.isArray(prev.serviceStyle[field])
            ? (prev.serviceStyle[field] as string[]).includes(value[0])
              ? (prev.serviceStyle[field] as string[]).filter(item => item !== value[0])
              : [...(prev.serviceStyle[field] as string[]), value[0]]
            : value
      }
    }));
  };

  const handleBrandIdentityChange = (field: keyof typeof currentConcept.brandIdentity, value: string | string[]) => {
    setCurrentConcept(prev => ({
      ...prev,
      brandIdentity: {
        ...prev.brandIdentity,
        [field]: value
      }
    }));
  };

  const saveConcept = () => {
    if (!currentConcept.name || !currentConcept.conceptType) {
      toast({
        title: "Error",
        description: "Please provide both name and concept type",
        variant: "destructive"
      });
      return;
    }

    setConcepts(prev => [...prev, currentConcept]);
    addTask(`Review restaurant concept: ${currentConcept.name}`);
    toast({
      title: "Success",
      description: "Restaurant concept saved successfully!",
    });

    // Reset form
    setCurrentConcept({
      id: Date.now().toString(),
      name: '',
      conceptType: '',
      vision: {
        missionStatement: '',
        coreValues: [],
        targetEmotion: []
      },
      atmosphere: {
        style: [],
        lighting: [],
        music: [],
        seating: []
      },
      serviceStyle: {
        type: '',
        interactions: [],
        specialFeatures: []
      },
      brandIdentity: {
        colors: [],
        personality: [],
        story: ''
      },
      uniqueFeatures: []
    });
    setCurrentStep(1);
  };

  const renderBasicConcept = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Restaurant Name</label>
        <input
          type="text"
          value={currentConcept.name}
          onChange={(e) => handleBasicInfoChange('name', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Urban Harvest Kitchen"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Concept Type</label>
        <select
          value={currentConcept.conceptType}
          onChange={(e) => handleBasicInfoChange('conceptType', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select concept type</option>
          <option value="Fine Dining">Fine Dining</option>
          <option value="Casual Dining">Casual Dining</option>
          <option value="Fast Casual">Fast Casual</option>
          <option value="Quick Service">Quick Service</option>
          <option value="Cafe">Cafe</option>
          <option value="Bistro">Bistro</option>
          <option value="Food Hall">Food Hall</option>
          <option value="Ghost Kitchen">Ghost Kitchen</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Unique Features</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            "Open Kitchen",
            "Chef's Table",
            "Outdoor Seating",
            "Live Entertainment",
            "Interactive Experience",
            "Sustainable Practices",
            "Local Sourcing",
            "Themed Events"
          ].map((feature) => (
            <Button
              key={feature}
              variant={currentConcept.uniqueFeatures.includes(feature) ? "default" : "outline"}
              onClick={() => setCurrentConcept(prev => ({
                ...prev,
                uniqueFeatures: prev.uniqueFeatures.includes(feature)
                  ? prev.uniqueFeatures.filter(f => f !== feature)
                  : [...prev.uniqueFeatures, feature]
              }))}
              size="sm"
            >
              {feature}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVisionValues = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Mission Statement</label>
        <textarea
          value={currentConcept.vision.missionStatement}
          onChange={(e) => handleVisionChange('missionStatement', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          rows={4}
          placeholder="Describe your restaurant's mission and purpose..."
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Core Values</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Quality",
            "Innovation",
            "Sustainability",
            "Community",
            "Authenticity",
            "Hospitality",
            "Tradition",
            "Excellence"
          ].map((value) => (
            <Button
              key={value}
              variant={currentConcept.vision.coreValues.includes(value) ? "default" : "outline"}
              onClick={() => handleVisionChange(
                'coreValues',
                currentConcept.vision.coreValues.includes(value)
                  ? currentConcept.vision.coreValues.filter(v => v !== value)
                  : [...currentConcept.vision.coreValues, value]
              )}
              size="sm"
            >
              {value}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Target Emotions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Comfort",
            "Excitement",
            "Nostalgia",
            "Joy",
            "Wonder",
            "Relaxation",
            "Energy",
            "Connection"
          ].map((emotion) => (
            <Button
              key={emotion}
              variant={currentConcept.vision.targetEmotion.includes(emotion) ? "default" : "outline"}
              onClick={() => handleVisionChange(
                'targetEmotion',
                currentConcept.vision.targetEmotion.includes(emotion)
                  ? currentConcept.vision.targetEmotion.filter(e => e !== emotion)
                  : [...currentConcept.vision.targetEmotion, emotion]
              )}
              size="sm"
            >
              {emotion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAtmosphere = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Interior Style</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Modern",
            "Industrial",
            "Rustic",
            "Minimalist",
            "Traditional",
            "Eclectic",
            "Coastal",
            "Urban"
          ].map((style) => (
            <Button
              key={style}
              variant={currentConcept.atmosphere.style.includes(style) ? "default" : "outline"}
              onClick={() => handleAtmosphereToggle('style', style)}
              size="sm"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Lighting</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Natural",
            "Warm",
            "Dim",
            "Bright",
            "Accent",
            "Dramatic",
            "Ambient",
            "Dynamic"
          ].map((lighting) => (
            <Button
              key={lighting}
              variant={currentConcept.atmosphere.lighting.includes(lighting) ? "default" : "outline"}
              onClick={() => handleAtmosphereToggle('lighting', lighting)}
              size="sm"
            >
              {lighting}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Music & Sound</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Live Music",
            "Ambient",
            "Jazz",
            "Contemporary",
            "World",
            "Classical",
            "Silent",
            "Dynamic"
          ].map((music) => (
            <Button
              key={music}
              variant={currentConcept.atmosphere.music.includes(music) ? "default" : "outline"}
              onClick={() => handleAtmosphereToggle('music', music)}
              size="sm"
            >
              {music}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Seating Arrangement</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Intimate",
            "Communal",
            "Booth",
            "Bar",
            "Outdoor",
            "Private Rooms",
            "Flexible",
            "Mixed"
          ].map((seating) => (
            <Button
              key={seating}
              variant={currentConcept.atmosphere.seating.includes(seating) ? "default" : "outline"}
              onClick={() => handleAtmosphereToggle('seating', seating)}
              size="sm"
            >
              {seating}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServiceStyle = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Service Type</label>
        <select
          value={currentConcept.serviceStyle.type}
          onChange={(e) => handleServiceStyleChange('type', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select service type</option>
          <option value="Full Service">Full Service</option>
          <option value="Counter Service">Counter Service</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Self Service">Self Service</option>
          <option value="Buffet">Buffet</option>
          <option value="Food Hall">Food Hall</option>
        </select>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Service Interactions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Tableside Service",
            "Order at Counter",
            "Digital Ordering",
            "Table Technology",
            "Personal Greeting",
            "Interactive Experience",
            "Self-Guided",
            "Mixed Format"
          ].map((interaction) => (
            <Button
              key={interaction}
              variant={currentConcept.serviceStyle.interactions.includes(interaction) ? "default" : "outline"}
              onClick={() => handleServiceStyleChange('interactions', [interaction])}
              size="sm"
            >
              {interaction}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Special Features</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Table-Side Preparation",
            "Chef Interaction",
            "Digital Menu",
            "Customization Options",
            "Loyalty Program",
            "Special Events",
            "Cooking Classes",
            "Private Dining"
          ].map((feature) => (
            <Button
              key={feature}
              variant={currentConcept.serviceStyle.specialFeatures.includes(feature) ? "default" : "outline"}
              onClick={() => handleServiceStyleChange('specialFeatures', [feature])}
              size="sm"
            >
              {feature}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBrandIdentity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Color Palette</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Earth Tones",
            "Vibrant",
            "Monochrome",
            "Pastels",
            "Bold",
            "Neutral",
            "Warm",
            "Cool"
          ].map((color) => (
            <Button
              key={color}
              variant={currentConcept.brandIdentity.colors.includes(color) ? "default" : "outline"}
              onClick={() => handleBrandIdentityChange(
                'colors',
                currentConcept.brandIdentity.colors.includes(color)
                  ? currentConcept.brandIdentity.colors.filter(c => c !== color)
                  : [...currentConcept.brandIdentity.colors, color]
              )}
              size="sm"
            >
              {color}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Brand Personality</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Sophisticated",
            "Friendly",
            "Innovative",
            "Traditional",
            "Playful",
            "Professional",
            "Authentic",
            "Bold"
          ].map((trait) => (
            <Button
              key={trait}
              variant={currentConcept.brandIdentity.personality.includes(trait) ? "default" : "outline"}
              onClick={() => handleBrandIdentityChange(
                'personality',
                currentConcept.brandIdentity.personality.includes(trait)
                  ? currentConcept.brandIdentity.personality.filter(p => p !== trait)
                  : [...currentConcept.brandIdentity.personality, trait]
              )}
              size="sm"
            >
              {trait}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Brand Story</label>
        <textarea
          value={currentConcept.brandIdentity.story}
          onChange={(e) => handleBrandIdentityChange('story', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          rows={4}
          placeholder="Tell your brand's story..."
        />
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicConcept();
      case 2:
        return renderVisionValues();
      case 3:
        return renderAtmosphere();
      case 4:
        return renderServiceStyle();
      case 5:
        return renderBrandIdentity();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Restaurant Concept Builder</CardTitle>
        <CardDescription>Design your unique restaurant concept</CardDescription>
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
              <Button onClick={saveConcept}>
                <Save className="h-4 w-4 mr-2" />
                Save Concept
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {concepts.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Concepts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {concepts.map((concept) => (
                  <Card key={concept.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{concept.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {concept.conceptType}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Style:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {concept.atmosphere.style.slice(0, 3).map((style, index) => (
                            <span
                              key={index}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {style}
                            </span>
                          ))}
                          {concept.atmosphere.style.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{concept.atmosphere.style.length - 3} more
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