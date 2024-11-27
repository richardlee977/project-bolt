import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Save,
  ScrollText,
  Utensils,
  X
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  popularity: number;
  contribution: number;
  classification?: 'star' | 'plow horse' | 'puzzle' | 'dog';
}

interface MenuCategory {
  name: string;
  description: string;
  items: MenuItem[];
}

interface MenuDesign {
  id: string;
  name: string;
  categories: MenuCategory[];
  layout: string;
  style: string[];
  descriptions: string[];
  pricing: string[];
}

const steps = [
  {
    title: "Menu Categories",
    description: "Define menu sections",
    icon: FileText
  },
  {
    title: "Menu Items",
    description: "Add dishes & details",
    icon: Utensils
  },
  {
    title: "Analysis",
    description: "Performance metrics",
    icon: BarChart2
  },
  {
    title: "Design",
    description: "Layout & style",
    icon: ScrollText
  }
];

export default function MenuEngineeringTool() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [menus, setMenus] = useState<MenuDesign[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentMenu, setCurrentMenu] = useState<MenuDesign>({
    id: Date.now().toString(),
    name: '',
    categories: [],
    layout: '',
    style: [],
    descriptions: [],
    pricing: []
  });

  const handleBasicInfoChange = (field: string, value: string) => {
    setCurrentMenu(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCategory = () => {
    setCurrentMenu(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        { name: '', description: '', items: [] }
      ]
    }));
  };

  const updateCategory = (index: number, field: string, value: string) => {
    setCurrentMenu(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const removeCategory = (index: number) => {
    setCurrentMenu(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const addMenuItem = (categoryIndex: number) => {
    setCurrentMenu(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              items: [
                ...cat.items,
                {
                  id: Date.now().toString(),
                  name: '',
                  category: cat.name,
                  price: 0,
                  cost: 0,
                  popularity: 0,
                  contribution: 0
                }
              ]
            }
          : cat
      )
    }));
  };

  const updateMenuItem = (categoryIndex: number, itemIndex: number, field: string, value: string | number) => {
    setCurrentMenu(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              items: cat.items.map((item, j) =>
                j === itemIndex
                  ? { ...item, [field]: value }
                  : item
              )
            }
          : cat
      )
    }));
  };

  const removeMenuItem = (categoryIndex: number, itemIndex: number) => {
    setCurrentMenu(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              items: cat.items.filter((_, j) => j !== itemIndex)
            }
          : cat
      )
    }));
  };

  const calculateMenuMetrics = () => {
    let allItems: MenuItem[] = [];
    currentMenu.categories.forEach(cat => {
      allItems = [...allItems, ...cat.items];
    });

    // Calculate average contribution and popularity

    // Update menu with classified items
    // setCurrentMenu(prev => ({
    //   ...prev,
    //   categories: prev.categories.map(cat => ({
    //     ...cat,
    //     items: cat.items.map(item => ({
    //       ...item,
    //       classification: classifiedItems.find(i => i.id === item.id)?.classification
    //     }))
    //   }))
    // }));
  };

  const saveMenu = () => {
    if (!currentMenu.name) {
      toast({
        title: "Error",
        description: "Please provide a name for your menu",
        variant: "destructive"
      });
      return;
    }

    calculateMenuMetrics();
    setMenus(prev => [...prev, currentMenu]);
    addTask(`Review menu design for ${currentMenu.name}`);
    toast({
      title: "Success",
      description: "Menu design saved successfully!",
    });

    // Reset form
    setCurrentMenu({
      id: Date.now().toString(),
      name: '',
      categories: [],
      layout: '',
      style: [],
      descriptions: [],
      pricing: []
    });
    setCurrentStep(1);
  };

  const renderCategories = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Menu Name</label>
        <input
          type="text"
          value={currentMenu.name}
          onChange={(e) => handleBasicInfoChange('name', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Dinner Menu"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Menu Categories</h3>
          <Button onClick={addCategory} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
        <div className="space-y-4">
          {currentMenu.categories.map((category, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => updateCategory(index, 'name', e.target.value)}
                  className="flex-1 p-2 border rounded-md mr-2"
                  placeholder="Category name"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeCategory(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <textarea
                value={category.description}
                onChange={(e) => updateCategory(index, 'description', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Category description"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMenuItems = () => (
    <div className="space-y-6">
      {currentMenu.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{category.name}</h3>
            <Button onClick={() => addMenuItem(categoryIndex)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          <div className="space-y-4">
            {category.items.map((item, itemIndex) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'name', e.target.value)}
                    className="flex-1 p-2 border rounded-md mr-2"
                    placeholder="Item name"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMenuItem(categoryIndex, itemIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Price ($)</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'price', parseFloat(e.target.value))}
                      className="w-full p-2 border rounded-md"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Cost ($)</label>
                    <input
                      type="number"
                      value={item.cost}
                      onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'cost', parseFloat(e.target.value))}
                      className="w-full p-2 border rounded-md"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Popularity (0-100)</label>
                    <input
                      type="number"
                      value={item.popularity}
                      onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'popularity', parseInt(e.target.value))}
                      className="w-full p-2 border rounded-md"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Contribution ($)</label>
                    <input
                      type="number"
                      value={item.contribution}
                      onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'contribution', parseFloat(e.target.value))}
                      className="w-full p-2 border rounded-md"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      {currentMenu.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <h3 className="font-medium">{category.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.name}</h4>
                    {item.classification && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.classification === 'star'
                          ? 'bg-yellow-100 text-yellow-800'
                          : item.classification === 'plow horse'
                          ? 'bg-green-100 text-green-800'
                          : item.classification === 'puzzle'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.classification.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost:</span>
                      <span>${item.cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margin:</span>
                      <span>{((item.price - item.cost) / item.price * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Popularity:</span>
                      <span>{item.popularity}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDesign = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Menu Layout</h3>
        <select
          value={currentMenu.layout}
          onChange={(e) => handleBasicInfoChange('layout', e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select layout</option>
          <option value="Single Page">Single Page</option>
          <option value="Bi-fold">Bi-fold</option>
          <option value="Tri-fold">Tri-fold</option>
          <option value="Multi-page">Multi-page</option>
          <option value="Digital Display">Digital Display</option>
        </select>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Design Style</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Modern",
            "Classic",
            "Minimalist",
            "Rustic",
            "Elegant",
            "Playful",
            "Traditional",
            "Contemporary"
          ].map((style) => (
            <Button
              key={style}
              variant={currentMenu.style.includes(style) ? "default" : "outline"}
              onClick={() => setCurrentMenu(prev => ({
                ...prev,
                style: prev.style.includes(style)
                  ? prev.style.filter(s => s !== style)
                  : [...prev.style, style]
              }))}
              size="sm"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Description Style</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Detailed",
            "Concise",
            "Story-telling",
            "Ingredients-focused",
            "Preparation-method",
            "Cultural-context",
            "Allergen-info",
            "Dietary-labels"
          ].map((desc) => (
            <Button
              key={desc}
              variant={currentMenu.descriptions.includes(desc) ? "default" : "outline"}
              onClick={() => setCurrentMenu(prev => ({
                ...prev,
                descriptions: prev.descriptions.includes(desc)
                  ? prev.descriptions.filter(d => d !== desc)
                  : [...prev.descriptions, desc]
              }))}
              size="sm"
            >
              {desc}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Pricing Display</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Simple Numbers",
            "Currency Symbol",
            "Decimal Points",
            "No Zeros",
            "Right-aligned",
            "Size Variations",
            "Price Anchoring",
            "Bundle Pricing"
          ].map((price) => (
            <Button
              key={price}
              variant={currentMenu.pricing.includes(price) ? "default" : "outline"}
              onClick={() => setCurrentMenu(prev => ({
                ...prev,
                pricing: prev.pricing.includes(price)
                  ? prev.pricing.filter(p => p !== price)
                  : [...prev.pricing, price]
              }))}
              size="sm"
            >
              {price}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderCategories();
      case 2:
        return renderMenuItems();
      case 3:
        return renderAnalysis();
      case 4:
        return renderDesign();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Engineering Tool</CardTitle>
        <CardDescription>Design and optimize your menu for maximum profitability</CardDescription>
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
              <Button onClick={saveMenu}>
                <Save className="h-4 w-4 mr-2" />
                Save Menu
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {menus.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Menus</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map((menu) => (
                  <Card key={menu.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{menu.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {menu.layout} • {menu.style.join(', ')}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Categories:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {menu.categories.slice(0, 3).map((category, index) => (
                            <span
                              key={index}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {category.name}
                            </span>
                          ))}
                          {menu.categories.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{menu.categories.length - 3} more
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