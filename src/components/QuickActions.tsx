import { Calculator, Camera, Bell, BarChart2, Calendar, Settings } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { icon: Calculator, label: 'Quick Calculate', color: 'text-blue-600 bg-blue-100' },
    { icon: Camera, label: 'Snap Content', color: 'text-purple-600 bg-purple-100' },
    { icon: Bell, label: 'Reminders', color: 'text-orange-600 bg-orange-100' },
    { icon: BarChart2, label: 'Daily Stats', color: 'text-green-600 bg-green-100' },
    { icon: Calendar, label: 'Schedule', color: 'text-red-600 bg-red-100' },
    { icon: Settings, label: 'Settings', color: 'text-gray-600 bg-gray-100' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
      {actions.map(({ icon: Icon, label, color }, index) => (
        <button
          key={index}
          className="flex flex-col items-center p-4 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className="mt-2 text-sm text-gray-600">{label}</span>
        </button>
      ))}
    </div>
  );
}