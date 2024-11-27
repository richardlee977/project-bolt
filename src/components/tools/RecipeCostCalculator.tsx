import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Plus,
  Save,
  ShoppingBag,
  X
} from 'lucide-react';
import { useState } from 'react';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  unitCost: number;
  quantity: number;
  totalCost: number;
}

interface Recipe {
  id: string;
  name: string;
  category: string;
  servingSize: number;
  ingredients: Ingredient[];
  laborCost: number;
  overheadCost: number;
  targetMargin: number;
  suggestedPrice: number;
}

const steps = [
  {
    title: "Recipe Info",
    description: "Basic details",
    icon: FileText
  },
  {
    title: "Ingredients",
    description: "Add ingredients",
    icon: ShoppingBag
  },
  {
    title: "Costs",
    description: "Labor & overhead",
    icon: DollarSign
  },
  {
    title: "Pricing",
    description: "Set margins",
    icon: Calculator
  }
];

export default function RecipeCostCalculator() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>({
    id: Date.now().toString(),
    name: '',
    category: '',
    servingSize: 1,
    ingredients: [],
    laborCost: 0,
    overheadCost: 0,
    targetMargin: 0,
    suggestedPrice: 0
  });

  const handleBasicInfoChange = (field: string, value: string | number) => {
    setCurrentRecipe(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addIngredient = () => {
    setCurrentRecipe(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          id: Date.now().toString(),
          name: '',
          unit: '',
          unitCost: 0,
          quantity: 0,
          totalCost: 0
        }
      ]
    }));
  };

  const updateIngredient = (index: number, field: string, value: string | number) => {
    setCurrentRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => {
        if (i === index) {
          const updatedIng = { ...ing, [field]: value };
          // Recalculate total cost if unit cost or quantity changes
          if (field === 'unitCost' || field === 'quantity') {
            updatedIng.totalCost = updatedIng.unitCost * updatedIng.quantity;
          }
          return updatedIng;
        }
        return ing;
      })
    }));
  };

  const removeIngredient = (index: number) => {
    setCurrentRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const calculateTotalCost = () => {
    const ingredientsCost = currentRecipe.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0);
    const totalCost = ingredientsCost + currentRecipe.laborCost + currentRecipe.overheadCost;
    const costPerServing = totalCost / currentRecipe.servingSize;
    const suggestedPrice = costPerServing / (1 - (currentRecipe.targetMargin / 100));
    
    setCurrentRecipe(prev => ({
      ...prev,
      suggestedPrice: parseFloat(suggestedPrice.toFixed(2))
    }));
  };

  const saveRecipe = () => {
    if (!currentRecipe.name) {
      toast({
        title: "Error",
        description: "Please provide a name for your recipe",
        variant: "destructive"
      });
      return;
    }

    calculateTotalCost();
    setRecipes(prev => [...prev, currentRecipe]);
    addTask(`Review recipe costs for ${currentRecipe.name}`);
    toast({
      title: "Success",
      description: "Recipe cost calculation saved successfully!",
    });

    // Reset form
    setCurrentRecipe({
      id: Date.now().toString(),
      name: '',
      category: '',
      servingSize: 1,
      ingredients: [],
      laborCost: 0,
      overheadCost: 0,
      targetMargin: 0,
      suggestedPrice: 0
    });
    setCurrentStep(1);
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Recipe Name</label>
        <input
          type="text"
          value={currentRecipe.name}
          onChange={(e) => handleBasicInfoChange('name', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Classic Margherita Pizza"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Category</label>
        <select
          value={currentRecipe.category}
          onChange={(e) => handleBasicInfoChange('category', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select category</option>
          <option value="Appetizers">Appetizers</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Beverages">Beverages</option>
          <option value="Sides">Sides</option>
          <option value="Specials">Specials</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Serving Size</label>
        <input
          type="number"
          value={currentRecipe.servingSize}
          onChange={(e) => handleBasicInfoChange('servingSize', parseInt(e.target.value))}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="Number of servings"
          min="1"
        />
      </div>
    </div>
  );

  const renderIngredients = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Ingredients List</h3>
        <Button onClick={addIngredient} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Ingredient
        </Button>
      </div>
      <div className="space-y-4">
        {currentRecipe.ingredients.map((ingredient, index) => (
          <div key={ingredient.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                className="flex-1 p-2 border rounded-md mr-2"
                placeholder="Ingredient name"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeIngredient(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-600">Unit</label>
                <select
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select unit</option>
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="l">Liters (l)</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="oz">Ounces (oz)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="cup">Cups</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Unit Cost ($)</label>
                <input
                  type="number"
                  value={ingredient.unitCost}
                  onChange={(e) => updateIngredient(index, 'unitCost', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Quantity</label>
                <input
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Total Cost ($)</label>
                <input
                  type="number"
                  value={ingredient.totalCost.toFixed(2)}
                  className="w-full p-2 border rounded-md bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCosts = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Ingredients Summary</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Ingredients:</span>
                <span>{currentRecipe.ingredients.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Ingredients Cost:</span>
                <span>${currentRecipe.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost per Serving:</span>
                <span>${(currentRecipe.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0) / currentRecipe.servingSize).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <label className="text-sm font-medium">Labor Cost ($)</label>
        <input
          type="number"
          value={currentRecipe.laborCost}
          onChange={(e) => handleBasicInfoChange('laborCost', parseFloat(e.target.value))}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="0.00"
          min="0"
          step="0.01"
        />
        <p className="text-sm text-gray-500 mt-1">Include preparation time, cooking time, and service costs</p>
      </div>
      <div>
        <label className="text-sm font-medium">Overhead Cost ($)</label>
        <input
          type="number"
          value={currentRecipe.overheadCost}
          onChange={(e) => handleBasicInfoChange('overheadCost', parseFloat(e.target.value))}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="0.00"
          min="0"
          step="0.01"
        />
        <p className="text-sm text-gray-500 mt-1">Include utilities, equipment usage, and other indirect costs</p>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Cost Summary</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ingredients Cost:</span>
                <span>${currentRecipe.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor Cost:</span>
                <span>${currentRecipe.laborCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Overhead Cost:</span>
                <span>${currentRecipe.overheadCost.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total Cost:</span>
                <span>${(
                  currentRecipe.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0) +
                  currentRecipe.laborCost +
                  currentRecipe.overheadCost
                ).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Cost per Serving:</span>
                <span>${(
                  (currentRecipe.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0) +
                  currentRecipe.laborCost +
                  currentRecipe.overheadCost) /
                  currentRecipe.servingSize
                ).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <label className="text-sm font-medium">Target Profit Margin (%)</label>
        <input
          type="number"
          value={currentRecipe.targetMargin}
          onChange={(e) => handleBasicInfoChange('targetMargin', parseFloat(e.target.value))}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="0"
          min="0"
          max="100"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Suggested Pricing</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Suggested Price per Serving</label>
                <div className="text-3xl font-bold text-primary mt-1">
                  ${currentRecipe.suggestedPrice.toFixed(2)}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                This price is calculated based on your total costs and target profit margin.
                Consider market factors and competition when setting your final price.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderIngredients();
      case 3:
        return renderCosts();
      case 4:
        return renderPricing();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Cost Calculator</CardTitle>
        <CardDescription>Calculate accurate food costs and determine optimal pricing</CardDescription>
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
              <Button onClick={saveRecipe}>
                <Save className="h-4 w-4 mr-2" />
                Save Recipe
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {recipes.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Recipes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                  <Card key={recipe.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{recipe.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {recipe.category} • {recipe.servingSize} servings
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Cost per Serving:</span>
                          <span>${(
                            (recipe.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0) +
                            recipe.laborCost +
                            recipe.overheadCost) /
                            recipe.servingSize
                          ).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Suggested Price:</span>
                          <span className="font-medium text-primary">
                            ${recipe.suggestedPrice.toFixed(2)}
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