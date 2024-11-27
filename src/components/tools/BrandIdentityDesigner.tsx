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
  Image, Layout,
  Palette,
  Save,
  Type
} from 'lucide-react';
import { useState } from 'react';

interface BrandIdentity {
  id: string;
  name: string;
  colorPalette: {
    primary: string;
    secondary: string[];
    accent: string[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    style: string[];
  };
  visualElements: {
    logoStyle: string[];
    imagery: string[];
    patterns: string[];
  };
  moodBoard: {
    keywords: string[];
    inspirations: string[];
    feelings: string[];
  };
  applications: {
    menu: string[];
    signage: string[];
    packaging: string[];
    digital: string[];
  };
}

const steps = [
  {
    title: "Colors",
    description: "Color palette selection",
    icon: Palette
  },
  {
    title: "Typography",
    description: "Font and text styles",
    icon: Type
  },
  {
    title: "Visual Elements",
    description: "Logo and imagery",
    icon: Image
  },
  {
    title: "Mood & Style",
    description: "Brand personality",
    icon: Heart
  },
  {
    title: "Applications",
    description: "Brand usage",
    icon: Layout
  }
];

export default function BrandIdentityDesigner() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [identities, setIdentities] = useState<BrandIdentity[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentIdentity, setCurrentIdentity] = useState<BrandIdentity>({
    id: Date.now().toString(),
    name: '',
    colorPalette: {
      primary: '',
      secondary: [],
      accent: []
    },
    typography: {
      headingFont: '',
      bodyFont: '',
      style: []
    },
    visualElements: {
      logoStyle: [],
      imagery: [],
      patterns: []
    },
    moodBoard: {
      keywords: [],
      inspirations: [],
      feelings: []
    },
    applications: {
      menu: [],
      signage: [],
      packaging: [],
      digital: []
    }
  });

  const handleBasicInfoChange = (value: string) => {
    setCurrentIdentity(prev => ({
      ...prev,
      name: value
    }));
  };

  const handleColorChange = (category: keyof typeof currentIdentity.colorPalette, value: string) => {
    setCurrentIdentity(prev => ({
      ...prev,
      colorPalette: {
        ...prev.colorPalette,
        [category]: Array.isArray(prev.colorPalette[category])
          ? (prev.colorPalette[category] as string[]).includes(value)
            ? (prev.colorPalette[category] as string[]).filter(c => c !== value)
            : [...(prev.colorPalette[category] as string[]), value]
          : value
      }
    }));
  };

  const handleTypographyChange = (field: keyof typeof currentIdentity.typography, value: string) => {
    setCurrentIdentity(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [field]: Array.isArray(prev.typography[field])
          ? (prev.typography[field] as string[]).includes(value)
            ? (prev.typography[field] as string[]).filter(t => t !== value)
            : [...(prev.typography[field] as string[]), value]
          : value
      }
    }));
  };

  const handleVisualElementsToggle = (category: keyof typeof currentIdentity.visualElements, value: string) => {
    setCurrentIdentity(prev => ({
      ...prev,
      visualElements: {
        ...prev.visualElements,
        [category]: prev.visualElements[category].includes(value)
          ? prev.visualElements[category].filter(item => item !== value)
          : [...prev.visualElements[category], value]
      }
    }));
  };

  const handleMoodBoardToggle = (category: keyof typeof currentIdentity.moodBoard, value: string) => {
    setCurrentIdentity(prev => ({
      ...prev,
      moodBoard: {
        ...prev.moodBoard,
        [category]: prev.moodBoard[category].includes(value)
          ? prev.moodBoard[category].filter(item => item !== value)
          : [...prev.moodBoard[category], value]
      }
    }));
  };

  const handleApplicationsToggle = (category: keyof typeof currentIdentity.applications, value: string) => {
    setCurrentIdentity(prev => ({
      ...prev,
      applications: {
        ...prev.applications,
        [category]: prev.applications[category].includes(value)
          ? prev.applications[category].filter(item => item !== value)
          : [...prev.applications[category], value]
      }
    }));
  };

  const saveIdentity = () => {
    if (!currentIdentity.name) {
      toast({
        title: "Error",
        description: "Please provide a name for your brand identity",
        variant: "destructive"
      });
      return;
    }

    setIdentities(prev => [...prev, currentIdentity]);
    addTask(`Review brand identity for ${currentIdentity.name}`);
    toast({
      title: "Success",
      description: "Brand identity saved successfully!",
    });

    // Reset form
    setCurrentIdentity({
      id: Date.now().toString(),
      name: '',
      colorPalette: {
        primary: '',
        secondary: [],
        accent: []
      },
      typography: {
        headingFont: '',
        bodyFont: '',
        style: []
      },
      visualElements: {
        logoStyle: [],
        imagery: [],
        patterns: []
      },
      moodBoard: {
        keywords: [],
        inspirations: [],
        feelings: []
      },
      applications: {
        menu: [],
        signage: [],
        packaging: [],
        digital: []
      }
    });
    setCurrentStep(1);
  };

  const renderColorPalette = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Brand Name</label>
        <input
          type="text"
          value={currentIdentity.name}
          onChange={(e) => handleBasicInfoChange(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Urban Spice Kitchen"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Primary Color Theme</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Warm & Earthy",
            "Cool & Calm",
            "Bold & Vibrant",
            "Neutral & Elegant",
            "Dark & Moody",
            "Light & Fresh"
          ].map((color) => (
            <Button
              key={color}
              variant={currentIdentity.colorPalette.primary === color ? "default" : "outline"}
              onClick={() => handleColorChange('primary', color)}
              size="sm"
            >
              {color}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Secondary Colors</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Natural Wood",
            "Terracotta",
            "Sage Green",
            "Ocean Blue",
            "Warm Gray",
            "Soft Gold",
            "Deep Purple",
            "Rustic Red"
          ].map((color) => (
            <Button
              key={color}
              variant={currentIdentity.colorPalette.secondary.includes(color) ? "default" : "outline"}
              onClick={() => handleColorChange('secondary', color)}
              size="sm"
            >
              {color}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Accent Colors</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Metallic Gold",
            "Copper",
            "Emerald",
            "Ruby",
            "Sapphire",
            "Bronze",
            "Pearl",
            "Charcoal"
          ].map((color) => (
            <Button
              key={color}
              variant={currentIdentity.colorPalette.accent.includes(color) ? "default" : "outline"}
              onClick={() => handleColorChange('accent', color)}
              size="sm"
            >
              {color}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTypography = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Heading Font Style</h3>
        <select
          value={currentIdentity.typography.headingFont}
          onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select heading font</option>
          <option value="Modern Sans-Serif">Modern Sans-Serif</option>
          <option value="Classic Serif">Classic Serif</option>
          <option value="Elegant Script">Elegant Script</option>
          <option value="Bold Display">Bold Display</option>
          <option value="Artisanal">Artisanal</option>
        </select>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Body Font Style</h3>
        <select
          value={currentIdentity.typography.bodyFont}
          onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select body font</option>
          <option value="Clean Sans-Serif">Clean Sans-Serif</option>
          <option value="Readable Serif">Readable Serif</option>
          <option value="Modern Geometric">Modern Geometric</option>
          <option value="Friendly Rounded">Friendly Rounded</option>
        </select>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Typography Style</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Bold Headers",
            "Elegant Spacing",
            "Mixed Weights",
            "Minimal",
            "Dynamic Scale",
            "Handwritten Accents",
            "Classic Hierarchy",
            "Modern Contrast"
          ].map((style) => (
            <Button
              key={style}
              variant={currentIdentity.typography.style.includes(style) ? "default" : "outline"}
              onClick={() => handleTypographyChange('style', style)}
              size="sm"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVisualElements = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Logo Style</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Minimalist",
            "Illustrative",
            "Typography-Based",
            "Icon + Text",
            "Emblem",
            "Abstract",
            "Vintage",
            "Modern"
          ].map((style) => (
            <Button
              key={style}
              variant={currentIdentity.visualElements.logoStyle.includes(style) ? "default" : "outline"}
              onClick={() => handleVisualElementsToggle('logoStyle', style)}
              size="sm"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Imagery Style</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Food Close-ups",
            "Lifestyle",
            "Ingredient-Focused",
            "Action Shots",
            "Environmental",
            "People-Centric",
            "Artistic",
            "Documentary"
          ].map((style) => (
            <Button
              key={style}
              variant={currentIdentity.visualElements.imagery.includes(style) ? "default" : "outline"}
              onClick={() => handleVisualElementsToggle('imagery', style)}
              size="sm"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Pattern & Texture</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Geometric",
            "Organic",
            "Cultural",
            "Natural",
            "Abstract",
            "Textural",
            "Minimal",
            "Repeating"
          ].map((pattern) => (
            <Button
              key={pattern}
              variant={currentIdentity.visualElements.patterns.includes(pattern) ? "default" : "outline"}
              onClick={() => handleVisualElementsToggle('patterns', pattern)}
              size="sm"
            >
              {pattern}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMoodBoard = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Brand Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Authentic",
            "Modern",
            "Welcoming",
            "Sophisticated",
            "Artisanal",
            "Vibrant",
            "Cozy",
            "Innovative"
          ].map((keyword) => (
            <Button
              key={keyword}
              variant={currentIdentity.moodBoard.keywords.includes(keyword) ? "default" : "outline"}
              onClick={() => handleMoodBoardToggle('keywords', keyword)}
              size="sm"
            >
              {keyword}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Visual Inspiration</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Nature",
            "Urban Life",
            "Travel",
            "Architecture",
            "Art",
            "Culture",
            "Craft",
            "Heritage"
          ].map((inspiration) => (
            <Button
              key={inspiration}
              variant={currentIdentity.moodBoard.inspirations.includes(inspiration) ? "default" : "outline"}
              onClick={() => handleMoodBoardToggle('inspirations', inspiration)}
              size="sm"
            >
              {inspiration}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Emotional Response</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Comfort",
            "Excitement",
            "Trust",
            "Luxury",
            "Nostalgia",
            "Energy",
            "Calm",
            "Joy"
          ].map((feeling) => (
            <Button
              key={feeling}
              variant={currentIdentity.moodBoard.feelings.includes(feeling) ? "default" : "outline"}
              onClick={() => handleMoodBoardToggle('feelings', feeling)}
              size="sm"
            >
              {feeling}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Menu Design</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Clean Layout",
            "Photo-Rich",
            "Minimalist",
            "Illustrated",
            "Story-Driven",
            "Interactive",
            "Traditional",
            "Modern Grid"
          ].map((style) => (
            <Button
              key={style}
              variant={currentIdentity.applications.menu.includes(style) ? "default" : "outline"}
              onClick={() => handleApplicationsToggle('menu', style)}
              size="sm"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Signage Style</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Illuminated",
            "Dimensional",
            "Hand-Painted",
            "Digital Display",
            "Architectural",
            "Window Graphics",
            "Minimal",
            "Statement"
          ].map((style) => (
            <Button
              key={style}
              variant={currentIdentity.applications.signage.includes(style) ? "default" : "outline"}
              onClick={() => handleApplicationsToggle('signage', style)}
              size="sm"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Packaging Elements</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Eco-Friendly",
            "Premium",
            "Branded Pattern",
            "Simple & Clean",
            "Storytelling",
            "Custom Stamps",
            "Color-Coded",
            "Artistic"
          ].map((element) => (
            <Button
              key={element}
              variant={currentIdentity.applications.packaging.includes(element) ? "default" : "outline"}
              onClick={() => handleApplicationsToggle('packaging', element)}
              size="sm"
            >
              {element}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Digital Presence</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Website Design",
            "Social Media",
            "Email Templates",
            "Mobile App",
            "Digital Menu",
            "Online Ordering",
            "Virtual Tour",
            "Content Style"
          ].map((digital) => (
            <Button
              key={digital}
              variant={currentIdentity.applications.digital.includes(digital) ? "default" : "outline"}
              onClick={() => handleApplicationsToggle('digital', digital)}
              size="sm"
            >
              {digital}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderColorPalette();
      case 2:
        return renderTypography();
      case 3:
        return renderVisualElements();
      case 4:
        return renderMoodBoard();
      case 5:
        return renderApplications();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Identity Designer</CardTitle>
        <CardDescription>Create a cohesive visual identity for your restaurant</CardDescription>
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
              <Button onClick={saveIdentity}>
                <Save className="h-4 w-4 mr-2" />
                Save Brand Identity
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {identities.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Brand Identities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {identities.map((identity) => (
                  <Card key={identity.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{identity.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {identity.colorPalette.primary}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Style Elements:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {identity.visualElements.logoStyle.slice(0, 3).map((style, index) => (
                            <span
                              key={index}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {style}
                            </span>
                          ))}
                          {identity.visualElements.logoStyle.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{identity.visualElements.logoStyle.length - 3} more
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