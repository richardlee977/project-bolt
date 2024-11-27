import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Save,
  Sun,
  TrendingUp,
  Users
} from 'lucide-react';
import { useState } from 'react';

interface DemandForecast {
  id: string;
  location: string;
  timeframe: string;
  seasonalFactors: {
    weather: string[];
    events: string[];
    holidays: string[];
  };
  customerSegments: {
    primary: string[];
    secondary: string[];
    peakHours: string[];
  };
  demandDrivers: {
    internal: string[];
    external: string[];
  };
  projections: {
    weekday: {
      morning: number;
      afternoon: number;
      evening: number;
    };
    weekend: {
      morning: number;
      afternoon: number;
      evening: number;
    };
  };
}

const steps = [
  {
    title: "Basic Info",
    description: "Location & timeframe",
    icon: Calendar
  },
  {
    title: "Seasonal Factors",
    description: "Weather & events",
    icon: Sun
  },
  {
    title: "Customer Flow",
    description: "Peak times & segments",
    icon: Users
  },
  {
    title: "Projections",
    description: "Expected demand",
    icon: TrendingUp
  }
];

export default function DemandForecaster() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentForecast, setCurrentForecast] = useState<DemandForecast>({
    id: Date.now().toString(),
    location: '',
    timeframe: '',
    seasonalFactors: {
      weather: [],
      events: [],
      holidays: []
    },
    customerSegments: {
      primary: [],
      secondary: [],
      peakHours: []
    },
    demandDrivers: {
      internal: [],
      external: []
    },
    projections: {
      weekday: {
        morning: 0,
        afternoon: 0,
        evening: 0
      },
      weekend: {
        morning: 0,
        afternoon: 0,
        evening: 0
      }
    }
  });

  const handleBasicInfoChange = (field: string, value: string) => {
    setCurrentForecast(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSeasonalFactorToggle = (category: keyof typeof currentForecast.seasonalFactors, value: string) => {
    setCurrentForecast(prev => ({
      ...prev,
      seasonalFactors: {
        ...prev.seasonalFactors,
        [category]: prev.seasonalFactors[category].includes(value)
          ? prev.seasonalFactors[category].filter(item => item !== value)
          : [...prev.seasonalFactors[category], value]
      }
    }));
  };

  const handleCustomerSegmentToggle = (category: keyof typeof currentForecast.customerSegments, value: string) => {
    setCurrentForecast(prev => ({
      ...prev,
      customerSegments: {
        ...prev.customerSegments,
        [category]: prev.customerSegments[category].includes(value)
          ? prev.customerSegments[category].filter(item => item !== value)
          : [...prev.customerSegments[category], value]
      }
    }));
  };

  const handleProjectionChange = (dayType: 'weekday' | 'weekend', timeSlot: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setCurrentForecast(prev => ({
      ...prev,
      projections: {
        ...prev.projections,
        [dayType]: {
          ...prev.projections[dayType],
          [timeSlot]: numValue
        }
      }
    }));
  };

  const saveForecast = () => {
    if (!currentForecast.location || !currentForecast.timeframe) {
      toast({
        title: "Error",
        description: "Please provide both location and timeframe",
        variant: "destructive"
      });
      return;
    }

    setForecasts(prev => [...prev, currentForecast]);
    addTask(`Review demand forecast for ${currentForecast.location}`);
    toast({
      title: "Success",
      description: "Demand forecast saved successfully!",
    });

    // Reset form
    setCurrentForecast({
      id: Date.now().toString(),
      location: '',
      timeframe: '',
      seasonalFactors: {
        weather: [],
        events: [],
        holidays: []
      },
      customerSegments: {
        primary: [],
        secondary: [],
        peakHours: []
      },
      demandDrivers: {
        internal: [],
        external: []
      },
      projections: {
        weekday: {
          morning: 0,
          afternoon: 0,
          evening: 0
        },
        weekend: {
          morning: 0,
          afternoon: 0,
          evening: 0
        }
      }
    });
    setCurrentStep(1);
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Location</label>
        <input
          type="text"
          value={currentForecast.location}
          onChange={(e) => handleBasicInfoChange('location', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Downtown Main Street"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Forecast Timeframe</label>
        <select
          value={currentForecast.timeframe}
          onChange={(e) => handleBasicInfoChange('timeframe', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select timeframe</option>
          <option value="Next Month">Next Month</option>
          <option value="Next Quarter">Next Quarter</option>
          <option value="Next 6 Months">Next 6 Months</option>
          <option value="Next Year">Next Year</option>
        </select>
      </div>
    </div>
  );

  const renderSeasonalFactors = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Weather Impact</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Hot Summer",
            "Mild Weather",
            "Cold Winter",
            "Rainy Season",
            "Perfect Patio",
            "Indoor Focus"
          ].map((weather) => (
            <Button
              key={weather}
              variant={currentForecast.seasonalFactors.weather.includes(weather) ? "default" : "outline"}
              onClick={() => handleSeasonalFactorToggle('weather', weather)}
              size="sm"
            >
              {weather}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-3">Local Events</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Sports Games",
            "Festivals",
            "Conventions",
            "Concerts",
            "Markets",
            "School Events"
          ].map((event) => (
            <Button
              key={event}
              variant={currentForecast.seasonalFactors.events.includes(event) ? "default" : "outline"}
              onClick={() => handleSeasonalFactorToggle('events', event)}
              size="sm"
            >
              {event}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-3">Holiday Seasons</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Christmas",
            "New Year",
            "Valentine's",
            "Summer Break",
            "Thanksgiving",
            "Spring Break"
          ].map((holiday) => (
            <Button
              key={holiday}
              variant={currentForecast.seasonalFactors.holidays.includes(holiday) ? "default" : "outline"}
              onClick={() => handleSeasonalFactorToggle('holidays', holiday)}
              size="sm"
            >
              {holiday}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCustomerFlow = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Primary Customer Segments</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Office Workers",
            "Students",
            "Families",
            "Tourists",
            "Young Professionals",
            "Retirees"
          ].map((segment) => (
            <Button
              key={segment}
              variant={currentForecast.customerSegments.primary.includes(segment) ? "default" : "outline"}
              onClick={() => handleCustomerSegmentToggle('primary', segment)}
              size="sm"
            >
              {segment}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-3">Peak Hours</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Early Morning",
            "Breakfast",
            "Lunch Rush",
            "Afternoon",
            "Dinner",
            "Late Night"
          ].map((hour) => (
            <Button
              key={hour}
              variant={currentForecast.customerSegments.peakHours.includes(hour) ? "default" : "outline"}
              onClick={() => handleCustomerSegmentToggle('peakHours', hour)}
              size="sm"
            >
              {hour}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjections = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Weekday Projections</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['morning', 'afternoon', 'evening'].map((timeSlot) => (
            <div key={timeSlot} className="space-y-2">
              <label className="text-sm font-medium capitalize">{timeSlot}</label>
              <input
                type="number"
                value={currentForecast.projections.weekday[timeSlot as keyof typeof currentForecast.projections.weekday]}
                onChange={(e) => handleProjectionChange('weekday', timeSlot, e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Expected customers"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-4">Weekend Projections</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['morning', 'afternoon', 'evening'].map((timeSlot) => (
            <div key={timeSlot} className="space-y-2">
              <label className="text-sm font-medium capitalize">{timeSlot}</label>
              <input
                type="number"
                value={currentForecast.projections.weekend[timeSlot as keyof typeof currentForecast.projections.weekend]}
                onChange={(e) => handleProjectionChange('weekend', timeSlot, e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Expected customers"
                min="0"
              />
            </div>
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
        return renderSeasonalFactors();
      case 3:
        return renderCustomerFlow();
      case 4:
        return renderProjections();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand Forecaster</CardTitle>
        <CardDescription>Project customer demand and identify peak periods</CardDescription>
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
              <Button onClick={saveForecast}>
                <Save className="h-4 w-4 mr-2" />
                Save Forecast
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {forecasts.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Forecasts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forecasts.map((forecast) => (
                  <Card key={forecast.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{forecast.location}</h4>
                      <p className="text-sm text-muted-foreground">
                        {forecast.timeframe}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Peak Times:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {forecast.customerSegments.peakHours.slice(0, 3).map((peak, index) => (
                            <span
                              key={index}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {peak}
                            </span>
                          ))}
                          {forecast.customerSegments.peakHours.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{forecast.customerSegments.peakHours.length - 3} more
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