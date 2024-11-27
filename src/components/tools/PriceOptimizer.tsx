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
  Percent,
  Plus,
  Save,
  Target,
  TrendingUp,
  X
} from 'lucide-react';
import { useState } from 'react';

interface PricePoint {
  id: string;
  itemName: string;
  costPrice: number;
  competitorPrices: number[];
  marketPosition: string;
  elasticity: string;
  suggestedPrice: number;
  projectedVolume: number;
}

interface PricingStrategy {
  id: string;
  name: string;
  marketSegment: string;
  competitivePosition: string;
  pricePoints: PricePoint[];
  margins: {
    target: number;
    minimum: number;
    maximum: number;
  };
  optimization: {
    factors: string[];
    recommendations: string[];
  };
}

const steps = [
  {
    title: "Market Position",
    description: "Competitive analysis",
    icon: Target
  },
  {
    title: "Price Points",
    description: "Item pricing",
    icon: DollarSign
  },
  {
    title: "Margins",
    description: "Profit targets",
    icon: Percent
  },
  {
    title: "Optimization",
    description: "Price optimization",
    icon: TrendingUp
  }
];

export default function PriceOptimizer() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [strategies, setStrategies] = useState<PricingStrategy[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentStrategy, setCurrentStrategy] = useState<PricingStrategy>({
    id: Date.now().toString(),
    name: '',
    marketSegment: '',
    competitivePosition: '',
    pricePoints: [],
    margins: {
      target: 0,
      minimum: 0,
      maximum: 0
    },
    optimization: {
      factors: [],
      recommendations: []
    }
  });

  const handleBasicInfoChange = (field: string, value: string) => {
    setCurrentStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPricePoint = () => {
    setCurrentStrategy(prev => ({
      ...prev,
      pricePoints: [
        ...prev.pricePoints,
        {
          id: Date.now().toString(),
          itemName: '',
          costPrice: 0,
          competitorPrices: [],
          marketPosition: '',
          elasticity: '',
          suggestedPrice: 0,
          projectedVolume: 0
        }
      ]
    }));
  };

  const updatePricePoint = (index: number, field: string, value: string | number) => {
    setCurrentStrategy(prev => ({
      ...prev,
      pricePoints: prev.pricePoints.map((point, i) => {
        if (i === index) {
          const updatedPoint = { ...point, [field]: value };
          // Calculate suggested price based on market position and competitor prices
          if (field === 'marketPosition' || field === 'costPrice' || field === 'competitorPrices') {
            const avgCompetitorPrice = point.competitorPrices.reduce((a, b) => a + b, 0) / point.competitorPrices.length || 0;
            let markup = 1.3; // Default markup

            switch (point.marketPosition) {
              case 'Premium':
                markup = 1.5;
                break;
              case 'Value':
                markup = 1.2;
                break;
              case 'Economy':
                markup = 1.1;
                break;
            }

            updatedPoint.suggestedPrice = Math.max(
              point.costPrice * markup,
              avgCompetitorPrice * (point.marketPosition === 'Premium' ? 1.1 : 0.9)
            );
          }
          return updatedPoint;
        }
        return point;
      })
    }));
  };

  const addCompetitorPrice = (pricePointIndex: number, price: number) => {
    setCurrentStrategy(prev => ({
      ...prev,
      pricePoints: prev.pricePoints.map((point, i) =>
        i === pricePointIndex
          ? {
              ...point,
              competitorPrices: [...point.competitorPrices, price]
            }
          : point
      )
    }));
  };

  const removeCompetitorPrice = (pricePointIndex: number, priceIndex: number) => {
    setCurrentStrategy(prev => ({
      ...prev,
      pricePoints: prev.pricePoints.map((point, i) =>
        i === pricePointIndex
          ? {
              ...point,
              competitorPrices: point.competitorPrices.filter((_, j) => j !== priceIndex)
            }
          : point
      )
    }));
  };

  const removePricePoint = (index: number) => {
    setCurrentStrategy(prev => ({
      ...prev,
      pricePoints: prev.pricePoints.filter((_, i) => i !== index)
    }));
  };

  const handleMarginChange = (field: keyof typeof currentStrategy.margins, value: number) => {
    setCurrentStrategy(prev => ({
      ...prev,
      margins: {
        ...prev.margins,
        [field]: value
      }
    }));
  };

  const handleOptimizationToggle = (field: keyof typeof currentStrategy.optimization, value: string) => {
    setCurrentStrategy(prev => ({
      ...prev,
      optimization: {
        ...prev.optimization,
        [field]: prev.optimization[field].includes(value)
          ? prev.optimization[field].filter(f => f !== value)
          : [...prev.optimization[field], value]
      }
    }));
  };

  const generateRecommendations = () => {
    const recommendations: string[] = [];
    
    currentStrategy.pricePoints.forEach(point => {
      const avgCompetitorPrice = point.competitorPrices.reduce((a, b) => a + b, 0) / point.competitorPrices.length;
      const margin = (point.suggestedPrice - point.costPrice) / point.suggestedPrice * 100;

      if (margin < currentStrategy.margins.minimum) {
        recommendations.push(`Increase price for ${point.itemName} to meet minimum margin requirements`);
      }

      if (point.suggestedPrice > avgCompetitorPrice * 1.2) {
        recommendations.push(`Consider reviewing high price point for ${point.itemName}`);
      }

      if (point.marketPosition === 'Premium' && point.suggestedPrice <= avgCompetitorPrice) {
        recommendations.push(`Adjust pricing strategy for ${point.itemName} to maintain premium positioning`);
      }
    });

    setCurrentStrategy(prev => ({
      ...prev,
      optimization: {
        ...prev.optimization,
        recommendations
      }
    }));
  };

  const saveStrategy = () => {
    if (!currentStrategy.name) {
      toast({
        title: "Error",
        description: "Please provide a name for your pricing strategy",
        variant: "destructive"
      });
      return;
    }

    generateRecommendations();
    setStrategies(prev => [...prev, currentStrategy]);
    addTask(`Review pricing strategy for ${currentStrategy.name}`);
    toast({
      title: "Success",
      description: "Pricing strategy saved successfully!",
    });

    // Reset form
    setCurrentStrategy({
      id: Date.now().toString(),
      name: '',
      marketSegment: '',
      competitivePosition: '',
      pricePoints: [],
      margins: {
        target: 0,
        minimum: 0,
        maximum: 0
      },
      optimization: {
        factors: [],
        recommendations: []
      }
    });
    setCurrentStep(1);
  };

  const renderMarketPosition = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Strategy Name</label>
        <input
          type="text"
          value={currentStrategy.name}
          onChange={(e) => handleBasicInfoChange('name', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Summer Menu Pricing"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Target Market Segment</label>
        <select
          value={currentStrategy.marketSegment}
          onChange={(e) => handleBasicInfoChange('marketSegment', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select market segment</option>
          <option value="High-End">High-End</option>
          <option value="Mid-Market">Mid-Market</option>
          <option value="Value">Value</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Competitive Position</label>
        <select
          value={currentStrategy.competitivePosition}
          onChange={(e) => handleBasicInfoChange('competitivePosition', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select position</option>
          <option value="Premium Leader">Premium Leader</option>
          <option value="Quality Mid-Range">Quality Mid-Range</option>
          <option value="Value Provider">Value Provider</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>
    </div>
  );

  const renderPricePoints = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Menu Items</h3>
        <Button onClick={addPricePoint} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      <div className="space-y-4">
        {currentStrategy.pricePoints.map((point, index) => (
          <div key={point.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={point.itemName}
                onChange={(e) => updatePricePoint(index, 'itemName', e.target.value)}
                className="flex-1 p-2 border rounded-md mr-2"
                placeholder="Item name"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removePricePoint(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600">Cost Price ($)</label>
                <input
                  type="number"
                  value={point.costPrice}
                  onChange={(e) => updatePricePoint(index, 'costPrice', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Market Position</label>
                <select
                  value={point.marketPosition}
                  onChange={(e) => updatePricePoint(index, 'marketPosition', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select position</option>
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Value">Value</option>
                  <option value="Economy">Economy</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Price Elasticity</label>
                <select
                  value={point.elasticity}
                  onChange={(e) => updatePricePoint(index, 'elasticity', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select elasticity</option>
                  <option value="High">High (Price Sensitive)</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low (Price Insensitive)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Competitor Prices</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {point.competitorPrices.map((price, priceIndex) => (
                  <div key={priceIndex} className="flex items-center space-x-1">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      ${price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeCompetitorPrice(index, priceIndex)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <input
                  type="number"
                  placeholder="Add price"
                  className="w-24 p-1 border rounded"
                  min="0"
                  step="0.01"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      addCompetitorPrice(index, parseFloat(input.value));
                      input.value = '';
                    }
                  }}
                />
              </div>
            </div>
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Suggested Price:</span>
                <span className="text-lg font-bold text-primary">
                  ${point.suggestedPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMargins = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Target Margin</h3>
        <input
          type="number"
          value={currentStrategy.margins.target}
          onChange={(e) => handleMarginChange('target', parseFloat(e.target.value))}
          className="w-full p-2 border rounded-md"
          placeholder="Target margin percentage"
          min="0"
          max="100"
        />
        <p className="text-sm text-gray-500 mt-1">
          Set your ideal profit margin percentage
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Minimum Margin (%)</label>
          <input
            type="number"
            value={currentStrategy.margins.minimum}
            onChange={(e) => handleMarginChange('minimum', parseFloat(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="0"
            min="0"
            max="100"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Maximum Margin (%)</label>
          <input
            type="number"
            value={currentStrategy.margins.maximum}
            onChange={(e) => handleMarginChange('maximum', parseFloat(e.target.value))}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="0"
            min="0"
            max="100"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Optimization Factors</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Competition",
            "Seasonality",
            "Time of Day",
            "Customer Segment",
            "Location",
            "Events",
            "Cost Changes",
            "Demand Patterns"
          ].map((factor) => (
            <Button
              key={factor}
              variant={currentStrategy.optimization.factors.includes(factor) ? "default" : "outline"}
              onClick={() => handleOptimizationToggle('factors', factor)}
              size="sm"
            >
              {factor}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Price Analysis</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {currentStrategy.pricePoints.map((point) => (
                <div key={point.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{point.itemName}</span>
                    <span className="text-primary font-bold">
                      ${point.suggestedPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Margin:</span>
                    <span>
                      {((point.suggestedPrice - point.costPrice) / point.suggestedPrice * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>vs Competition:</span>
                    <span>
                      {point.competitorPrices.length > 0
                        ? `${(((point.suggestedPrice / (point.competitorPrices.reduce((a, b) => a + b, 0) / point.competitorPrices.length)) - 1) * 100).toFixed(1)}%`
                        : 'N/A'}
                    </span>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Recommendations</h3>
        <div className="space-y-2">
          {currentStrategy.optimization.recommendations.map((rec, index) => (
            <div key={index} className="p-3 bg-primary/10 rounded-lg text-sm">
              {rec}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Dynamic Pricing Opportunities</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Happy Hour",
            "Early Bird",
            "Weekend Special",
            "Seasonal Menu",
            "Volume Discount",
            "Premium Time",
            "Event Pricing",
            "Package Deals"
          ].map((opportunity) => (
            <Button
              key={opportunity}
              variant={currentStrategy.optimization.factors.includes(opportunity) ? "default" : "outline"}
              onClick={() => handleOptimizationToggle('factors', opportunity)}
              size="sm"
            >
              {opportunity}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderMarketPosition();
      case 2:
        return renderPricePoints();
      case 3:
        return renderMargins();
      case 4:
        return renderOptimization();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Optimizer</CardTitle>
        <CardDescription>Optimize your menu pricing for maximum profitability</CardDescription>
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
              <Button onClick={saveStrategy}>
                <Save className="h-4 w-4 mr-2" />
                Save Strategy
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {strategies.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Strategies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategies.map((strategy) => (
                  <Card key={strategy.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{strategy.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {strategy.marketSegment} • {strategy.competitivePosition}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Items:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {strategy.pricePoints.slice(0, 3).map((point, index) => (
                            <span
                              key={index}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {point.itemName}
                            </span>
                          ))}
                          {strategy.pricePoints.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{strategy.pricePoints.length - 3} more
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