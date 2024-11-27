import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Plus,
  Save,
  Target,
  X
} from 'lucide-react';
import { useState } from 'react';

interface ConceptValidation {
  id: string;
  conceptName: string;
  marketResearch: {
    targetMarket: string[];
    competitors: {
      name: string;
      strengths: string[];
      gaps: string[];
    }[];
    marketSize: string;
  };
  financialValidation: {
    startupCosts: string[];
    revenueStreams: string[];
    profitMargins: string;
    breakEvenTime: string;
  };
  conceptTesting: {
    feedbackMethods: string[];
    testGroups: string[];
    keyFindings: string[];
  };
  riskAssessment: {
    identified: string[];
    mitigation: string[];
    impact: string[];
  };
  validationScore: {
    market: number;
    financial: number;
    operational: number;
    overall: number;
  };
}

const steps = [
  {
    title: "Market Research",
    description: "Target market & competition",
    icon: Target
  },
  {
    title: "Financial Validation",
    description: "Costs & projections",
    icon: DollarSign
  },
  {
    title: "Concept Testing",
    description: "Feedback & testing",
    icon: CheckCircle
  },
  {
    title: "Risk Assessment",
    description: "Identify & mitigate risks",
    icon: AlertCircle
  }
];

export default function ConceptValidator() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [validations, setValidations] = useState<ConceptValidation[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentValidation, setCurrentValidation] = useState<ConceptValidation>({
    id: Date.now().toString(),
    conceptName: '',
    marketResearch: {
      targetMarket: [],
      competitors: [],
      marketSize: ''
    },
    financialValidation: {
      startupCosts: [],
      revenueStreams: [],
      profitMargins: '',
      breakEvenTime: ''
    },
    conceptTesting: {
      feedbackMethods: [],
      testGroups: [],
      keyFindings: []
    },
    riskAssessment: {
      identified: [],
      mitigation: [],
      impact: []
    },
    validationScore: {
      market: 0,
      financial: 0,
      operational: 0,
      overall: 0
    }
  });

  const handleBasicInfoChange = (value: string) => {
    setCurrentValidation(prev => ({
      ...prev,
      conceptName: value
    }));
  };

  const handleMarketResearchToggle = (field: keyof typeof currentValidation.marketResearch, value: string) => {
    if (field === 'targetMarket') {
      setCurrentValidation(prev => ({
        ...prev,
        marketResearch: {
          ...prev.marketResearch,
          targetMarket: prev.marketResearch.targetMarket.includes(value)
            ? prev.marketResearch.targetMarket.filter(item => item !== value)
            : [...prev.marketResearch.targetMarket, value]
        }
      }));
    } else if (field === 'marketSize') {
      setCurrentValidation(prev => ({
        ...prev,
        marketResearch: {
          ...prev.marketResearch,
          marketSize: value
        }
      }));
    }
  };

  const addCompetitor = () => {
    setCurrentValidation(prev => ({
      ...prev,
      marketResearch: {
        ...prev.marketResearch,
        competitors: [
          ...prev.marketResearch.competitors,
          { name: '', strengths: [], gaps: [] }
        ]
      }
    }));
  };

  const updateCompetitor = (index: number, field: string, value: string | string[]) => {
    setCurrentValidation(prev => ({
      ...prev,
      marketResearch: {
        ...prev.marketResearch,
        competitors: prev.marketResearch.competitors.map((comp, i) =>
          i === index
            ? { ...comp, [field]: value }
            : comp
        )
      }
    }));
  };

  const removeCompetitor = (index: number) => {
    setCurrentValidation(prev => ({
      ...prev,
      marketResearch: {
        ...prev.marketResearch,
        competitors: prev.marketResearch.competitors.filter((_, i) => i !== index)
      }
    }));
  };

  const handleFinancialValidationToggle = (field: keyof typeof currentValidation.financialValidation, value: string) => {
    if (Array.isArray(currentValidation.financialValidation[field])) {
      setCurrentValidation(prev => ({
        ...prev,
        financialValidation: {
          ...prev.financialValidation,
          [field]: (prev.financialValidation[field] as string[]).includes(value)
            ? (prev.financialValidation[field] as string[]).filter(item => item !== value)
            : [...(prev.financialValidation[field] as string[]), value]
        }
      }));
    } else {
      setCurrentValidation(prev => ({
        ...prev,
        financialValidation: {
          ...prev.financialValidation,
          [field]: value
        }
      }));
    }
  };

  const handleConceptTestingToggle = (field: keyof typeof currentValidation.conceptTesting, value: string) => {
    setCurrentValidation(prev => ({
      ...prev,
      conceptTesting: {
        ...prev.conceptTesting,
        [field]: prev.conceptTesting[field].includes(value)
          ? prev.conceptTesting[field].filter(item => item !== value)
          : [...prev.conceptTesting[field], value]
      }
    }));
  };

  const handleRiskAssessmentToggle = (field: keyof typeof currentValidation.riskAssessment, value: string) => {
    setCurrentValidation(prev => ({
      ...prev,
      riskAssessment: {
        ...prev.riskAssessment,
        [field]: prev.riskAssessment[field].includes(value)
          ? prev.riskAssessment[field].filter(item => item !== value)
          : [...prev.riskAssessment[field], value]
      }
    }));
  };

  const calculateValidationScore = () => {
    const marketScore = (
      (currentValidation.marketResearch.targetMarket.length / 5) * 100 +
      (currentValidation.marketResearch.competitors.length / 3) * 100
    ) / 2;

    const financialScore = (
      (currentValidation.financialValidation.startupCosts.length / 5) * 100 +
      (currentValidation.financialValidation.revenueStreams.length / 3) * 100
    ) / 2;

    const operationalScore = (
      (currentValidation.conceptTesting.feedbackMethods.length / 4) * 100 +
      (currentValidation.riskAssessment.mitigation.length / currentValidation.riskAssessment.identified.length || 0) * 100
    ) / 2;

    const overallScore = (marketScore + financialScore + operationalScore) / 3;

    setCurrentValidation(prev => ({
      ...prev,
      validationScore: {
        market: Math.round(marketScore),
        financial: Math.round(financialScore),
        operational: Math.round(operationalScore),
        overall: Math.round(overallScore)
      }
    }));
  };

  const saveValidation = () => {
    if (!currentValidation.conceptName) {
      toast({
        title: "Error",
        description: "Please provide a name for your concept",
        variant: "destructive"
      });
      return;
    }

    calculateValidationScore();
    setValidations(prev => [...prev, currentValidation]);
    addTask(`Review concept validation for ${currentValidation.conceptName}`);
    toast({
      title: "Success",
      description: "Concept validation saved successfully!",
    });

    // Reset form
    setCurrentValidation({
      id: Date.now().toString(),
      conceptName: '',
      marketResearch: {
        targetMarket: [],
        competitors: [],
        marketSize: ''
      },
      financialValidation: {
        startupCosts: [],
        revenueStreams: [],
        profitMargins: '',
        breakEvenTime: ''
      },
      conceptTesting: {
        feedbackMethods: [],
        testGroups: [],
        keyFindings: []
      },
      riskAssessment: {
        identified: [],
        mitigation: [],
        impact: []
      },
      validationScore: {
        market: 0,
        financial: 0,
        operational: 0,
        overall: 0
      }
    });
    setCurrentStep(1);
  };

  const renderMarketResearch = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Concept Name</label>
        <input
          type="text"
          value={currentValidation.conceptName}
          onChange={(e) => handleBasicInfoChange(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Urban Fusion Kitchen"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Target Market Segments</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Young Professionals",
            "Families",
            "Students",
            "Business Crowd",
            "Tourists",
            "Health Conscious",
            "Foodies",
            "Special Occasion"
          ].map((segment) => (
            <Button
              key={segment}
              variant={currentValidation.marketResearch.targetMarket.includes(segment) ? "default" : "outline"}
              onClick={() => handleMarketResearchToggle('targetMarket', segment)}
              size="sm"
            >
              {segment}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Competitor Analysis</h3>
          <Button onClick={addCompetitor} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Competitor
          </Button>
        </div>
        <div className="space-y-4">
          {currentValidation.marketResearch.competitors.map((competitor, index) => (
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
                  onClick={() => removeCompetitor(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <label className="text-sm text-gray-600">Key Strengths</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    "Location",
                    "Price",
                    "Quality",
                    "Service",
                    "Ambiance",
                    "Menu",
                    "Brand",
                    "Experience"
                  ].map((strength) => (
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
                <label className="text-sm text-gray-600">Market Gaps</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    "Price Point",
                    "Service Quality",
                    "Menu Variety",
                    "Atmosphere",
                    "Innovation",
                    "Convenience",
                    "Health Options",
                    "Experience"
                  ].map((gap) => (
                    <Button
                      key={gap}
                      variant={competitor.gaps.includes(gap) ? "default" : "outline"}
                      onClick={() => updateCompetitor(
                        index,
                        'gaps',
                        competitor.gaps.includes(gap)
                          ? competitor.gaps.filter(g => g !== gap)
                          : [...competitor.gaps, gap]
                      )}
                      size="sm"
                    >
                      {gap}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Market Size Estimation</label>
        <select
          value={currentValidation.marketResearch.marketSize}
          onChange={(e) => handleMarketResearchToggle('marketSize', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select market size</option>
          <option value="Small (Under 50k)">Small (Under 50k)</option>
          <option value="Medium (50k-200k)">Medium (50k-200k)</option>
          <option value="Large (200k-500k)">Large (200k-500k)</option>
          <option value="Very Large (500k+)">Very Large (500k+)</option>
        </select>
      </div>
    </div>
  );

  const renderFinancialValidation = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Startup Costs</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Location Renovation",
            "Kitchen Equipment",
            "Furniture & Decor",
            "Licenses & Permits",
            "Initial Inventory",
            "Marketing & Branding",
            "Technology Systems",
            "Working Capital"
          ].map((cost) => (
            <Button
              key={cost}
              variant={currentValidation.financialValidation.startupCosts.includes(cost) ? "default" : "outline"}
              onClick={() => handleFinancialValidationToggle('startupCosts', cost)}
              size="sm"
            >
              {cost}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Revenue Streams</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Dine-in",
            "Takeout",
            "Delivery",
            "Catering",
            "Events",
            "Merchandise",
            "Subscriptions",
            "Partnerships"
          ].map((stream) => (
            <Button
              key={stream}
              variant={currentValidation.financialValidation.revenueStreams.includes(stream) ? "default" : "outline"}
              onClick={() => handleFinancialValidationToggle('revenueStreams', stream)}
              size="sm"
            >
              {stream}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Expected Profit Margins</label>
        <select
          value={currentValidation.financialValidation.profitMargins}
          onChange={(e) => handleFinancialValidationToggle('profitMargins', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select profit margin range</option>
          <option value="Low (0-10%)">Low (0-10%)</option>
          <option value="Medium (10-20%)">Medium (10-20%)</option>
          <option value="High (20-30%)">High (20-30%)</option>
          <option value="Premium (30%+)">Premium (30%+)</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Break-even Timeline</label>
        <select
          value={currentValidation.financialValidation.breakEvenTime}
          onChange={(e) => handleFinancialValidationToggle('breakEvenTime', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select break-even timeline</option>
          <option value="6 months">6 months</option>
          <option value="1 year">1 year</option>
          <option value="1.5 years">1.5 years</option>
          <option value="2+ years">2+ years</option>
        </select>
      </div>
    </div>
  );

  const renderConceptTesting = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Feedback Methods</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Focus Groups",
            "Surveys",
            "Pop-up Events",
            "Social Media",
            "Expert Reviews",
            "Taste Testing",
            "Concept Presentation",
            "Market Research"
          ].map((method) => (
            <Button
              key={method}
              variant={currentValidation.conceptTesting.feedbackMethods.includes(method) ? "default" : "outline"}
              onClick={() => handleConceptTestingToggle('feedbackMethods', method)}
              size="sm"
            >
              {method}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Test Groups</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Target Demographics",
            "Industry Experts",
            "Local Community",
            "Food Critics",
            "Potential Investors",
            "Restaurant Staff",
            "Food Bloggers",
            "General Public"
          ].map((group) => (
            <Button
              key={group}
              variant={currentValidation.conceptTesting.testGroups.includes(group) ? "default" : "outline"}
              onClick={() => handleConceptTestingToggle('testGroups', group)}
              size="sm"
            >
              {group}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Key Findings</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Price Sensitivity",
            "Menu Preferences",
            "Service Expectations",
            "Atmosphere Feedback",
            "Location Concerns",
            "Competition Analysis",
            "Market Demand",
            "Concept Appeal"
          ].map((finding) => (
            <Button
              key={finding}
              variant={currentValidation.conceptTesting.keyFindings.includes(finding) ? "default" : "outline"}
              onClick={() => handleConceptTestingToggle('keyFindings', finding)}
              size="sm"
            >
              {finding}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRiskAssessment = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Identified Risks</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Market Competition",
            "Financial Risk",
            "Location Risk",
            "Operational Risk",
            "Staff Turnover",
            "Supply Chain",
            "Regulatory Changes",
            "Economic Factors"
          ].map((risk) => (
            <Button
              key={risk}
              variant={currentValidation.riskAssessment.identified.includes(risk) ? "default" : "outline"}
              onClick={() => handleRiskAssessmentToggle('identified', risk)}
              size="sm"
            >
              {risk}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Mitigation Strategies</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Unique Value Proposition",
            "Financial Buffers",
            "Location Analysis",
            "Staff Training",
            "Supplier Diversity",
            "Legal Compliance",
            "Insurance Coverage",
            "Market Research"
          ].map((strategy) => (
            <Button
              key={strategy}
              variant={currentValidation.riskAssessment.mitigation.includes(strategy) ? "default" : "outline"}
              onClick={() => handleRiskAssessmentToggle('mitigation', strategy)}
              size="sm"
            >
              {strategy}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Impact Assessment</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Revenue Impact",
            "Cost Impact",
            "Brand Impact",
            "Operational Impact",
            "Market Share",
            "Customer Base",
            "Staff Morale",
            "Growth Plans"
          ].map((impact) => (
            <Button
              key={impact}
              variant={currentValidation.riskAssessment.impact.includes(impact) ? "default" : "outline"}
              onClick={() => handleRiskAssessmentToggle('impact', impact)}
              size="sm"
            >
              {impact}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderMarketResearch();
      case 2:
        return renderFinancialValidation();
      case 3:
        return renderConceptTesting();
      case 4:
        return renderRiskAssessment();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Concept Validator</CardTitle>
        <CardDescription>Validate your restaurant concept through comprehensive analysis</CardDescription>
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
              <Button onClick={saveValidation}>
                <Save className="h-4 w-4 mr-2" />
                Save Validation
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {validations.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Validations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {validations.map((validation) => (
                  <Card key={validation.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{validation.conceptName}</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Market Score:</span>
                          <span className="text-sm font-medium">{validation.validationScore.market}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Financial Score:</span>
                          <span className="text-sm font-medium">{validation.validationScore.financial}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Operational Score:</span>
                          <span className="text-sm font-medium">{validation.validationScore.operational}%</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-sm">Overall Score:</span>
                          <span className={`text-sm ${
                            validation.validationScore.overall >= 70
                              ? 'text-green-600'
                              : validation.validationScore.overall >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                            {validation.validationScore.overall}%
                          </span>
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