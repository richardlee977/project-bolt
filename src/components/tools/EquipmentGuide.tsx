import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Save,
  Scale,
  Settings,
  ShoppingBag,
  X
} from 'lucide-react';
import { useState } from 'react';

interface Equipment {
  id: string;
  name: string;
  category: string;
  priority: string;
  specs: string[];
  features: string[];
  cost: {
    purchase: number;
    installation: number;
    maintenance: number;
  };
  suppliers: string[];
}

interface EquipmentPlan {
  id: string;
  name: string;
  restaurantType: string;
  budget: number;
  equipment: Equipment[];
  layout: string[];
  maintenance: string[];
  totalCost: number;
}

const steps = [
  {
    title: "Basic Info",
    description: "Plan details",
    icon: ShoppingBag
  },
  {
    title: "Equipment List",
    description: "Required items",
    icon: Package
  },
  {
    title: "Layout & Space",
    description: "Equipment layout",
    icon: Settings
  },
  {
    title: "Maintenance",
    description: "Upkeep planning",
    icon: Scale
  }
];

export default function EquipmentGuide() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [plans, setPlans] = useState<EquipmentPlan[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPlan, setCurrentPlan] = useState<EquipmentPlan>({
    id: Date.now().toString(),
    name: '',
    restaurantType: '',
    budget: 0,
    equipment: [],
    layout: [],
    maintenance: [],
    totalCost: 0
  });

  const handleBasicInfoChange = (field: string, value: string | number) => {
    setCurrentPlan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addEquipment = () => {
    setCurrentPlan(prev => ({
      ...prev,
      equipment: [
        ...prev.equipment,
        {
          id: Date.now().toString(),
          name: '',
          category: '',
          priority: '',
          specs: [],
          features: [],
          cost: {
            purchase: 0,
            installation: 0,
            maintenance: 0
          },
          suppliers: []
        }
      ]
    }));
  };

  const updateEquipment = (index: number, field: string, value: any) => {
    setCurrentPlan(prev => ({
      ...prev,
      equipment: prev.equipment.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
              ...(field.startsWith('cost.') && {
                cost: {
                  ...item.cost,
                  [field.split('.')[1]]: value
                }
              })
            }
          : item
      )
    }));
  };

  const removeEquipment = (index: number) => {
    setCurrentPlan(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const handleLayoutToggle = (value: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      layout: prev.layout.includes(value)
        ? prev.layout.filter(item => item !== value)
        : [...prev.layout, value]
    }));
  };

  const handleMaintenanceToggle = (value: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      maintenance: prev.maintenance.includes(value)
        ? prev.maintenance.filter(item => item !== value)
        : [...prev.maintenance, value]
    }));
  };

  const calculateTotalCost = () => {
    const equipmentCost = currentPlan.equipment.reduce((sum, item) => 
      sum + item.cost.purchase + item.cost.installation + item.cost.maintenance,
      0
    );

    setCurrentPlan(prev => ({
      ...prev,
      totalCost: equipmentCost
    }));
  };

  const savePlan = () => {
    if (!currentPlan.name) {
      toast({
        title: "Error",
        description: "Please provide a name for your equipment plan",
        variant: "destructive"
      });
      return;
    }

    calculateTotalCost();
    setPlans(prev => [...prev, currentPlan]);
    addTask(`Review equipment plan for ${currentPlan.name}`);
    toast({
      title: "Success",
      description: "Equipment plan saved successfully!",
    });

    // Reset form
    setCurrentPlan({
      id: Date.now().toString(),
      name: '',
      restaurantType: '',
      budget: 0,
      equipment: [],
      layout: [],
      maintenance: [],
      totalCost: 0
    });
    setCurrentStep(1);
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Plan Name</label>
        <input
          type="text"
          value={currentPlan.name}
          onChange={(e) => handleBasicInfoChange('name', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Main Kitchen Setup"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Restaurant Type</label>
        <select
          value={currentPlan.restaurantType}
          onChange={(e) => handleBasicInfoChange('restaurantType', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select type</option>
          <option value="Full Service">Full Service Restaurant</option>
          <option value="Quick Service">Quick Service Restaurant</option>
          <option value="Cafe">Cafe</option>
          <option value="Ghost Kitchen">Ghost Kitchen</option>
          <option value="Food Truck">Food Truck</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Equipment Budget ($)</label>
        <input
          type="number"
          value={currentPlan.budget}
          onChange={(e) => handleBasicInfoChange('budget', parseFloat(e.target.value))}
          className="w-full mt-1 p-2 border rounded-md"
          min="0"
          step="1000"
        />
      </div>
    </div>
  );

  const renderEquipmentList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Equipment Items</h3>
        <Button onClick={addEquipment} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>
      <div className="space-y-4">
        {currentPlan.equipment.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateEquipment(index, 'name', e.target.value)}
                  className="flex-1 p-2 border rounded-md mr-2"
                  placeholder="Equipment name"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeEquipment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <select
                    value={item.category}
                    onChange={(e) => updateEquipment(index, 'category', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select category</option>
                    <option value="Cooking">Cooking Equipment</option>
                    <option value="Refrigeration">Refrigeration</option>
                    <option value="Food Prep">Food Preparation</option>
                    <option value="Storage">Storage</option>
                    <option value="Cleaning">Cleaning Equipment</option>
                    <option value="Service">Service Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Priority</label>
                  <select
                    value={item.priority}
                    onChange={(e) => updateEquipment(index, 'priority', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select priority</option>
                    <option value="Essential">Essential</option>
                    <option value="Important">Important</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Specifications</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    "Energy Efficient",
                    "Space Saving",
                    "High Capacity",
                    "Digital Controls",
                    "NSF Certified",
                    "UL Listed",
                    "Commercial Grade",
                    "Easy Clean"
                  ].map((spec) => (
                    <Button
                      key={spec}
                      variant={item.specs.includes(spec) ? "default" : "outline"}
                      onClick={() => updateEquipment(
                        index,
                        'specs',
                        item.specs.includes(spec)
                          ? item.specs.filter(s => s !== spec)
                          : [...item.specs, spec]
                      )}
                      size="sm"
                    >
                      {spec}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Purchase Cost ($)</label>
                  <input
                    type="number"
                    value={item.cost.purchase}
                    onChange={(e) => updateEquipment(index, 'cost.purchase', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="0"
                    step="100"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Installation ($)</label>
                  <input
                    type="number"
                    value={item.cost.installation}
                    onChange={(e) => updateEquipment(index, 'cost.installation', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="0"
                    step="100"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Annual Maintenance ($)</label>
                  <input
                    type="number"
                    value={item.cost.maintenance}
                    onChange={(e) => updateEquipment(index, 'cost.maintenance', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="0"
                    step="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLayout = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Kitchen Layout Considerations</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Work Triangle",
            "Prep Station Flow",
            "Storage Access",
            "Safety Zones",
            "Ventilation",
            "Cleaning Areas",
            "Service Flow",
            "Emergency Access"
          ].map((layout) => (
            <Button
              key={layout}
              variant={currentPlan.layout.includes(layout) ? "default" : "outline"}
              onClick={() => handleLayoutToggle(layout)}
              size="sm"
            >
              {layout}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Equipment Placement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPlan.equipment.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.category}</p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Required Space:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.specs.map((spec, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Maintenance Schedule</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Daily Cleaning",
            "Weekly Inspection",
            "Monthly Service",
            "Quarterly Maintenance",
            "Annual Certification",
            "Emergency Repairs",
            "Staff Training",
            "Documentation"
          ].map((maintenance) => (
            <Button
              key={maintenance}
              variant={currentPlan.maintenance.includes(maintenance) ? "default" : "outline"}
              onClick={() => handleMaintenanceToggle(maintenance)}
              size="sm"
            >
              {maintenance}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Equipment Maintenance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPlan.equipment.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.priority === 'Essential'
                      ? 'bg-red-100 text-red-800'
                      : item.priority === 'Important'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Annual Maintenance:</span>
                    <span>${item.cost.maintenance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Interval:</span>
                    <span>{
                      item.priority === 'Essential'
                        ? 'Monthly'
                        : item.priority === 'Important'
                        ? 'Quarterly'
                        : 'Semi-Annual'
                    }</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
        return renderEquipmentList();
      case 3:
        return renderLayout();
      case 4:
        return renderMaintenance();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Guide</CardTitle>
        <CardDescription>Plan and manage your restaurant equipment effectively</CardDescription>
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
              <Button onClick={savePlan}>
                <Save className="h-4 w-4 mr-2" />
                Save Plan
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {plans.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Equipment Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <Card key={plan.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{plan.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {plan.restaurantType}
                      </p>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Items:</span>
                          <span>{plan.equipment.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Cost:</span>
                          <span className="font-medium text-primary">
                            ${plan.totalCost.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Categories:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Array.from(new Set(plan.equipment.map(e => e.category)))
                              .slice(0, 3)
                              .map((category, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                                >
                                  {category}
                                </span>
                              ))}
                          </div>
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