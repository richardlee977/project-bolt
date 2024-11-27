import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTaskContext } from '@/context/TaskContext';
import {
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Plus,
  Save,
  X
} from 'lucide-react';
import { useState } from 'react';

interface StaffRole {
  id: string;
  title: string;
  type: string;
  skills: string[];
  responsibilities: string[];
  shifts: string[];
  hourlyRate: number;
  headcount: number;
}

interface StaffSchedule {
  id: string;
  name: string;
  roles: StaffRole[];
  shifts: {
    morning: number;
    afternoon: number;
    evening: number;
    weekend: number;
  };
  budget: {
    hourly: number;
    weekly: number;
    monthly: number;
  };
  requirements: {
    certifications: string[];
    training: string[];
    policies: string[];
  };
}

const steps = [
  {
    title: "Roles & Skills",
    description: "Define positions",
    icon: Briefcase
  },
  {
    title: "Scheduling",
    description: "Shift planning",
    icon: Calendar
  },
  {
    title: "Budget",
    description: "Cost planning",
    icon: DollarSign
  },
  {
    title: "Requirements",
    description: "Staff policies",
    icon: FileText
  }
];

export default function StaffPlanner() {
  const { toast } = useToast();
  const { addTask } = useTaskContext();
  const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSchedule, setCurrentSchedule] = useState<StaffSchedule>({
    id: Date.now().toString(),
    name: '',
    roles: [],
    shifts: {
      morning: 0,
      afternoon: 0,
      evening: 0,
      weekend: 0
    },
    budget: {
      hourly: 0,
      weekly: 0,
      monthly: 0
    },
    requirements: {
      certifications: [],
      training: [],
      policies: []
    }
  });

  const handleBasicInfoChange = (value: string) => {
    setCurrentSchedule(prev => ({
      ...prev,
      name: value
    }));
  };

  const addRole = () => {
    setCurrentSchedule(prev => ({
      ...prev,
      roles: [
        ...prev.roles,
        {
          id: Date.now().toString(),
          title: '',
          type: '',
          skills: [],
          responsibilities: [],
          shifts: [],
          hourlyRate: 0,
          headcount: 1
        }
      ]
    }));
  };

  const updateRole = (index: number, field: string, value: string | number | string[]) => {
    setCurrentSchedule(prev => ({
      ...prev,
      roles: prev.roles.map((role, i) =>
        i === index ? { ...role, [field]: value } : role
      )
    }));
  };

  const removeRole = (index: number) => {
    setCurrentSchedule(prev => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index)
    }));
  };

  const handleShiftChange = (shift: keyof typeof currentSchedule.shifts, value: number) => {
    setCurrentSchedule(prev => ({
      ...prev,
      shifts: {
        ...prev.shifts,
        [shift]: value
      }
    }));
  };


  const handleRequirementsToggle = (category: keyof typeof currentSchedule.requirements, value: string) => {
    setCurrentSchedule(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [category]: prev.requirements[category].includes(value)
          ? prev.requirements[category].filter(item => item !== value)
          : [...prev.requirements[category], value]
      }
    }));
  };

  const calculateTotalCosts = () => {
    const totalHourlyRate = currentSchedule.roles.reduce(
      (sum, role) => sum + (role.hourlyRate * role.headcount),
      0
    );

    const weeklyHours = 
      (currentSchedule.shifts.morning + 
      currentSchedule.shifts.afternoon + 
      currentSchedule.shifts.evening) * 5 +
      currentSchedule.shifts.weekend * 2;

    const weeklyTotal = totalHourlyRate * weeklyHours;
    const monthlyTotal = weeklyTotal * 4.33; // Average weeks per month

    setCurrentSchedule(prev => ({
      ...prev,
      budget: {
        hourly: totalHourlyRate,
        weekly: weeklyTotal,
        monthly: monthlyTotal
      }
    }));
  };

  const saveSchedule = () => {
    if (!currentSchedule.name) {
      toast({
        title: "Error",
        description: "Please provide a name for your staffing schedule",
        variant: "destructive"
      });
      return;
    }

    calculateTotalCosts();
    setSchedules(prev => [...prev, currentSchedule]);
    addTask(`Review staffing plan for ${currentSchedule.name}`);
    toast({
      title: "Success",
      description: "Staff schedule saved successfully!",
    });

    // Reset form
    setCurrentSchedule({
      id: Date.now().toString(),
      name: '',
      roles: [],
      shifts: {
        morning: 0,
        afternoon: 0,
        evening: 0,
        weekend: 0
      },
      budget: {
        hourly: 0,
        weekly: 0,
        monthly: 0
      },
      requirements: {
        certifications: [],
        training: [],
        policies: []
      }
    });
    setCurrentStep(1);
  };

  const renderRolesAndSkills = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Schedule Name</label>
        <input
          type="text"
          value={currentSchedule.name}
          onChange={(e) => handleBasicInfoChange(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., Main Restaurant Staff Schedule"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Staff Roles</h3>
          <Button onClick={addRole} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </div>
        <div className="space-y-4">
          {currentSchedule.roles.map((role, index) => (
            <div key={role.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={role.title}
                  onChange={(e) => updateRole(index, 'title', e.target.value)}
                  className="flex-1 p-2 border rounded-md mr-2"
                  placeholder="Role title"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeRole(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Type</label>
                  <select
                    value={role.type}
                    onChange={(e) => updateRole(index, 'type', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Headcount</label>
                  <input
                    type="number"
                    value={role.headcount}
                    onChange={(e) => updateRole(index, 'headcount', parseInt(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Required Skills</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    "Food Preparation",
                    "Customer Service",
                    "Food Safety",
                    "Time Management",
                    "Team Leadership",
                    "POS Systems",
                    "Inventory Management",
                    "Communication"
                  ].map((skill) => (
                    <Button
                      key={skill}
                      variant={role.skills.includes(skill) ? "default" : "outline"}
                      onClick={() => updateRole(
                        index,
                        'skills',
                        role.skills.includes(skill)
                          ? role.skills.filter(s => s !== skill)
                          : [...role.skills, skill]
                      )}
                      size="sm"
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Responsibilities</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    "Food Prep",
                    "Cooking",
                    "Serving",
                    "Cleaning",
                    "Inventory",
                    "Training",
                    "Supervision",
                    "Customer Care"
                  ].map((resp) => (
                    <Button
                      key={resp}
                      variant={role.responsibilities.includes(resp) ? "default" : "outline"}
                      onClick={() => updateRole(
                        index,
                        'responsibilities',
                        role.responsibilities.includes(resp)
                          ? role.responsibilities.filter(r => r !== resp)
                          : [...role.responsibilities, resp]
                      )}
                      size="sm"
                    >
                      {resp}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={role.hourlyRate}
                  onChange={(e) => updateRole(index, 'hourlyRate', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">Shift Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekday Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Morning Shift Staff</label>
                  <input
                    type="number"
                    value={currentSchedule.shifts.morning}
                    onChange={(e) => handleShiftChange('morning', parseInt(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Afternoon Shift Staff</label>
                  <input
                    type="number"
                    value={currentSchedule.shifts.afternoon}
                    onChange={(e) => handleShiftChange('afternoon', parseInt(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Evening Shift Staff</label>
                  <input
                    type="number"
                    value={currentSchedule.shifts.evening}
                    onChange={(e) => handleShiftChange('evening', parseInt(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekend Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm text-gray-600">Weekend Staff per Shift</label>
                <input
                  type="number"
                  value={currentSchedule.shifts.weekend}
                  onChange={(e) => handleShiftChange('weekend', parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Role Shift Assignment</h3>
        <div className="space-y-4">
          {currentSchedule.roles.map((role, index) => (
            <div key={role.id} className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">{role.title}</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Morning (6AM-2PM)",
                  "Mid (10AM-6PM)",
                  "Afternoon (2PM-10PM)",
                  "Evening (4PM-12AM)",
                  "Night (10PM-6AM)",
                  "Weekend AM",
                  "Weekend PM",
                  "On-Call"
                ].map((shift) => (
                  <Button
                    key={shift}
                    variant={role.shifts.includes(shift) ? "default" : "outline"}
                    onClick={() => updateRole(
                      index,
                      'shifts',
                      role.shifts.includes(shift)
                        ? role.shifts.filter(s => s !== shift)
                        : [...role.shifts, shift]
                    )}
                    size="sm"
                  >
                    {shift}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBudget = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">Cost Overview</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Total Hourly Cost</label>
                  <div className="text-2xl font-bold text-primary mt-1">
                    ${currentSchedule.budget.hourly.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Weekly Projection</label>
                  <div className="text-2xl font-bold text-primary mt-1">
                    ${currentSchedule.budget.weekly.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Monthly Projection</label>
                  <div className="text-2xl font-bold text-primary mt-1">
                    ${currentSchedule.budget.monthly.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Role Cost Breakdown</h3>
        <div className="space-y-4">
          {currentSchedule.roles.map((role) => (
            <Card key={role.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{role.title}</h4>
                  <span className="text-sm text-gray-600">
                    {role.headcount} {role.headcount === 1 ? 'person' : 'people'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hourly Rate:</span>
                    <span>${role.hourlyRate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Daily Cost:</span>
                    <span>${(role.hourlyRate * 8 * role.headcount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Weekly Cost:</span>
                    <span>${(role.hourlyRate * 40 * role.headcount).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Required Certifications</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Food Handler's Certificate",
            "ServSafe Manager",
            "Alcohol Service",
            "First Aid",
            "Food Safety",
            "Health & Safety",
            "Fire Safety",
            "Allergen Awareness"
          ].map((cert) => (
            <Button
              key={cert}
              variant={currentSchedule.requirements.certifications.includes(cert) ? "default" : "outline"}
              onClick={() => handleRequirementsToggle('certifications', cert)}
              size="sm"
            >
              {cert}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Training Programs</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Onboarding",
            "Food Preparation",
            "Customer Service",
            "POS System",
            "Safety Procedures",
            "Quality Control",
            "Team Building",
            "Leadership"
          ].map((training) => (
            <Button
              key={training}
              variant={currentSchedule.requirements.training.includes(training) ? "default" : "outline"}
              onClick={() => handleRequirementsToggle('training', training)}
              size="sm"
            >
              {training}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Workplace Policies</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Dress Code",
            "Attendance",
            "Break Policy",
            "Phone Usage",
            "Hygiene Standards",
            "Time Off",
            "Scheduling",
            "Performance Review"
          ].map((policy) => (
            <Button
              key={policy}
              variant={currentSchedule.requirements.policies.includes(policy) ? "default" : "outline"}
              onClick={() => handleRequirementsToggle('policies', policy)}
              size="sm"
            >
              {policy}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderRolesAndSkills();
      case 2:
        return renderScheduling();
      case 3:
        return renderBudget();
      case 4:
        return renderRequirements();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Planner</CardTitle>
        <CardDescription>Plan and manage your restaurant staff effectively</CardDescription>
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
              <Button onClick={saveSchedule}>
                <Save className="h-4 w-4 mr-2" />
                Save Schedule
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {schedules.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-semibold mb-4">Saved Schedules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map((schedule) => (
                  <Card key={schedule.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{schedule.name}</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Staff:</span>
                          <span>{schedule.roles.reduce((sum, role) => sum + role.headcount, 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Monthly Budget:</span>
                          <span className="font-medium text-primary">
                            ${schedule.budget.monthly.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Roles:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {schedule.roles.slice(0, 3).map((role, index) => (
                              <span
                                key={index}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                              >
                                {role.title}
                              </span>
                            ))}
                            {schedule.roles.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{schedule.roles.length - 3} more
                              </span>
                            )}
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