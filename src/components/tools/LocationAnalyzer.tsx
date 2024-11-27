import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Map,
  Navigation,
  Save,
  Store,
  Users
} from 'lucide-react';
import { useState } from 'react';

interface LocationAnalysis {
  id: string;
  name: string;
  address: string;
  demographics: {
    population: string;
    income: string;
    ageGroups: string[];
    occupations: string[];
  };
  accessibility: {
    parking: string[];
    transport: string[];
    visibility: string[];
    traffic: string[];
  };
  competition: {
    direct: number;
    indirect: number;
    saturation: string;
    gaps: string[];
  };
  costs: {
    rent: number;
    utilities: number;
    renovation: number;
    licenses: string[];
  };
  score: {
    demographic: number;
    accessibility: number;
    competition: number;
    financial: number;
    overall: number;
  };
}

const steps = [
  {
    title: "Basic Info",
    description: "Location details",
    icon: Map
  },
  {
    title: "Demographics",
    description: "Target market",
    icon: Users
  },
  {
    title: "Accessibility",
    description: "Location access",
    icon: Navigation
  },
  {
    title: "Competition",
    description: "Market analysis",
    icon: Store
  },
  {
    title: "Costs",
    description: "Financial factors",
    icon: DollarSign
  }
];

export default function LocationAnalyzer() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [locations, setLocations] = useState<LocationAnalysis[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLocation, setCurrentLocation] = useState<LocationAnalysis>({
    id: Date.now().toString(),
    name: '',
    address: '',
    demographics: {
      population: '',
      income: '',
      ageGroups: [],
      occupations: []
    },
    accessibility: {
      parking: [],
      transport: [],
      visibility: [],
      traffic: []
    },
    competition: {
      direct: 0,
      indirect: 0,
      saturation: '',
      gaps: []
    },
    costs: {
      rent: 0,
      utilities: 0,
      renovation: 0,
      licenses: []
    },
    score: {
      demographic: 0,
      accessibility: 0,
      competition: 0,
      financial: 0,
      overall: 0
    }
  });

  const handleBasicInfoChange = (field: string, value: string) => {
    setCurrentLocation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDemographicsChange = (field: keyof typeof currentLocation.demographics, value: string | string[]) => {
    setCurrentLocation(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [field]: value
      }
    }));
  };

  const handleAccessibilityToggle = (category: keyof typeof currentLocation.accessibility, value: string) => {
    setCurrentLocation(prev => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [category]: prev.accessibility[category].includes(value)
          ? prev.accessibility[category].filter(item => item !== value)
          : [...prev.accessibility[category], value]
      }
    }));
  };

  const handleCompetitionChange = (field: keyof typeof currentLocation.competition, value: number | string | string[]) => {
    setCurrentLocation(prev => ({
      ...prev,
      competition: {
        ...prev.competition,
        [field]: value
      }
    }));
  };

  const handleCostsChange = (field: keyof typeof currentLocation.costs, value: number | string[]) => {
    setCurrentLocation(prev => ({
      ...prev,
      costs: {
        ...prev.costs,
        [field]: value
      }
    }));
  };

  const calculateScores = () => {
    // Calculate demographic score
    const demographicScore = 
      (currentLocation.demographics.ageGroups.length / 5) * 100 +
      (currentLocation.demographics.occupations.length / 5) * 100;

    // Calculate accessibility score
    const accessibilityScore = 
      (Object.values(currentLocation.accessibility).reduce((sum, arr) => sum + arr.length, 0) / 20) * 100;

    // Calculate competition score
    const competitionScore = 
      (1 - (currentLocation.competition.direct / 10)) * 50 +
      (currentLocation.competition.gaps.length / 5) * 50;

    // Calculate financial score
    const maxRent = 10000; // Example threshold
    const financialScore = 
      (1 - (currentLocation.costs.rent / maxRent)) * 100;

    // Calculate overall score
    const overallScore = (demographicScore + accessibilityScore + competitionScore + financialScore) / 4;

    setCurrentLocation(prev => ({
      ...prev,
      score: {
        demographic: Math.round(demographicScore),
        accessibility: Math.round(accessibilityScore),
        competition: Math.round(competitionScore),
        financial: Math.round(financialScore),
        overall: Math.round(overallScore)
      }
    }));
  };

  const saveLocation = () => {
    if (!currentLocation.name || !currentLocation.address) {
      toast({
        title: "Error",
        description: "Please provide both name and address for the location",
        variant: "destructive"
      });
      return;
    }

    calculateScores();
    setLocations(prev => [...prev, currentLocation]);
    addTask(`Review location analysis for ${currentLocation.name}`);
    toast({
      title: "Success",
      description: "Location analysis saved successfully!",
    });

    // Reset form
    setCurrentLocation({
      id: Date.now().toString(),
      name: '',
      address: '',
      demographics: {
        population: '',
        income: '',
        ageGroups: [],
        occupations: []
      },
      accessibility: {
        parking: [],
        transport: [],
        visibility: [],
        traffic: []
      },
      competition: {
        direct: 0,
        indirect: 0,
        saturation: '',
        gaps: []
      },
      costs: {
        rent: 0,
        utilities: 0,
        renovation: 0,
        licenses: []
      },
      score: {
        demographic: 0,
        accessibility: 0,
        competition: 0,
        financial: 0,
        overall: 0
      }
    });
    setCurrentStep(1);
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Location Name</label>
        <input
          type="text"
          value={currentLocation.name}
          onChange={(e) => handleBasicInfoChange('name', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Downtown Plaza Space"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Address</label>
        <textarea
          value={currentLocation.address}
          onChange={(e) => handleBasicInfoChange('address', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          rows={3}
          placeholder="Full address of the location"
        />
      </div>
    </div>
  );

  const renderDemographics = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Population Density</label>
        <select
          value={currentLocation.demographics.population}
          onChange={(e) => handleDemographicsChange('population', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select density</option>
          <option value="High">High Density</option>
          <option value="Medium">Medium Density</option>
          <option value="Low">Low Density</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Income Level</label>
        <select
          value={currentLocation.demographics.income}
          onChange={(e) => handleDemographicsChange('income', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select income level</option>
          <option value="High">High Income</option>
          <option value="Medium">Medium Income</option>
          <option value="Low">Low Income</option>
        </select>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Target Age Groups</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "18-24",
            "25-34",
            "35-44",
            "45-54",
            "55+"
          ].map((age) => (
            <Button
              key={age}
              variant={currentLocation.demographics.ageGroups.includes(age) ? "default" : "outline"}
              onClick={() => handleDemographicsChange(
                'ageGroups',
                currentLocation.demographics.ageGroups.includes(age)
                  ? currentLocation.demographics.ageGroups.filter(a => a !== age)
                  : [...currentLocation.demographics.ageGroups, age]
              )}
              size="sm"
            >
              {age}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Primary Occupations</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Office Workers",
            "Students",
            "Professionals",
            "Tourists",
            "Families",
            "Retirees"
          ].map((occupation) => (
            <Button
              key={occupation}
              variant={currentLocation.demographics.occupations.includes(occupation) ? "default" : "outline"}
              onClick={() => handleDemographicsChange(
                'occupations',
                currentLocation.demographics.occupations.includes(occupation)
                  ? currentLocation.demographics.occupations.filter(o => o !== occupation)
                  : [...currentLocation.demographics.occupations, occupation]
              )}
              size="sm"
            >
              {occupation}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccessibility = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Parking Availability</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Street Parking",
            "Private Lot",
            "Public Garage",
            "Valet Service",
            "Bike Racks",
            "Loading Zone"
          ].map((parking) => (
            <Button
              key={parking}
              variant={currentLocation.accessibility.parking.includes(parking) ? "default" : "outline"}
              onClick={() => handleAccessibilityToggle('parking', parking)}
              size="sm"
            >
              {parking}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Public Transport</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Bus Stop",
            "Train Station",
            "Subway",
            "Taxi Stand",
            "Ride Share",
            "Walking Distance"
          ].map((transport) => (
            <Button
              key={transport}
              variant={currentLocation.accessibility.transport.includes(transport) ? "default" : "outline"}
              onClick={() => handleAccessibilityToggle('transport', transport)}
              size="sm"
            >
              {transport}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Visibility Factors</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Main Street",
            "Corner Location",
            "Signage Allowed",
            "Window Display",
            "Landmark Area",
            "High Foot Traffic"
          ].map((visibility) => (
            <Button
              key={visibility}
              variant={currentLocation.accessibility.visibility.includes(visibility) ? "default" : "outline"}
              onClick={() => handleAccessibilityToggle('visibility', visibility)}
              size="sm"
            >
              {visibility}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Traffic Patterns</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Morning Rush",
            "Lunch Hour",
            "Evening Rush",
            "Weekend Flow",
            "Event Traffic",
            "Tourist Season"
          ].map((traffic) => (
            <Button
              key={traffic}
              variant={currentLocation.accessibility.traffic.includes(traffic) ? "default" : "outline"}
              onClick={() => handleAccessibilityToggle('traffic', traffic)}
              size="sm"
            >
              {traffic}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompetition = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Direct Competitors</label>
          <input
            type="number"
            value={currentLocation.competition.direct}
            onChange={(e) => handleCompetitionChange('direct', parseInt(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md"
            min="0"
          />
          <p className="text-sm text-gray-500 mt-1">
            Similar restaurants within 1 mile radius
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Indirect Competitors</label>
          <input
            type="number"
            value={currentLocation.competition.indirect}
            onChange={(e) => handleCompetitionChange('indirect', parseInt(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md"
            min="0"
          />
          <p className="text-sm text-gray-500 mt-1">
            Other food businesses in the area
          </p>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Market Saturation</label>
        <select
          value={currentLocation.competition.saturation}
          onChange={(e) => handleCompetitionChange('saturation', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select saturation level</option>
          <option value="High">High - Very Competitive</option>
          <option value="Medium">Medium - Balanced</option>
          <option value="Low">Low - Underserved</option>
        </select>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Market Gaps</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Fine Dining",
            "Fast Casual",
            "Healthy Options",
            "Ethnic Cuisine",
            "Breakfast/Brunch",
            "Late Night",
            "Delivery Focus",
            "Family Friendly"
          ].map((gap) => (
            <Button
              key={gap}
              variant={currentLocation.competition.gaps.includes(gap) ? "default" : "outline"}
              onClick={() => handleCompetitionChange(
                'gaps',
                currentLocation.competition.gaps.includes(gap)
                  ? currentLocation.competition.gaps.filter(g => g !== gap)
                  : [...currentLocation.competition.gaps, gap]
              )}
              size="sm"
            >
              {gap}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCosts = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Monthly Rent ($)</label>
          <input
            type="number"
            value={currentLocation.costs.rent}
            onChange={(e) => handleCostsChange('rent', parseFloat(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md"
            min="0"
            step="100"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Est. Monthly Utilities ($)</label>
          <input
            type="number"
            value={currentLocation.costs.utilities}
            onChange={(e) => handleCostsChange('utilities', parseFloat(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md"
            min="0"
            step="100"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Est. Renovation Cost ($)</label>
          <input
            type="number"
            value={currentLocation.costs.renovation}
            onChange={(e) => handleCostsChange('renovation', parseFloat(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md"
            min="0"
            step="1000"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Required Licenses & Permits</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Business License",
            "Food Service Permit",
            "Health Permit",
            "Liquor License",
            "Sign Permit",
            "Building Permit",
            "Fire Safety",
            "Outdoor Seating"
          ].map((license) => (
            <Button
              key={license}
              variant={currentLocation.costs.licenses.includes(license) ? "default" : "outline"}
              onClick={() => handleCostsChange(
                'licenses',
                currentLocation.costs.licenses.includes(license)
                  ? currentLocation.costs.licenses.filter(l => l !== license)
                  : [...currentLocation.costs.licenses, license]
              )}
              size="sm"
            >
              {license}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderDemographics();
      case 3:
        return renderAccessibility();
      case 4:
        return renderCompetition();
      case 5:
        return renderCosts();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Analyzer</CardTitle>
        <CardDescription>Evaluate potential restaurant locations comprehensively</CardDescription>
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
              <Button onClick={saveLocation}>
                <Save className="h-4 w-4 mr-2" />
                Save Location
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {locations.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Locations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <Card key={location.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{location.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {location.address}
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Demographics:</span>
                          <span className={`font-medium ${
                            location.score.demographic >= 70
                              ? 'text-green-600'
                              : location.score.demographic >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>{location.score.demographic}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Accessibility:</span>
                          <span className={`font-medium ${
                            location.score.accessibility >= 70
                              ? 'text-green-600'
                              : location.score.accessibility >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>{location.score.accessibility}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Competition:</span>
                          <span className={`font-medium ${
                            location.score.competition >= 70
                              ? 'text-green-600'
                              : location.score.competition >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>{location.score.competition}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Financial:</span>
                          <span className={`font-medium ${
                            location.score.financial >= 70
                              ? 'text-green-600'
                              : location.score.financial >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>{location.score.financial}%</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Overall Score:</span>
                          <span className={`${
                            location.score.overall >= 70
                              ? 'text-green-600'
                              : location.score.overall >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>{location.score.overall}%</span>
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