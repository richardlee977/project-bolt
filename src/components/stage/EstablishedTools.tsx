import { TrendingUp, DollarSign } from 'lucide-react';

export default function EstablishedTools() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold">Sales Analytics</h4>
            </div>
            <p className="text-sm text-gray-600">Track and analyze your sales performance</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold">Profit Optimizer</h4>
            </div>
            <p className="text-sm text-gray-600">Optimize costs and maximize profits</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Operations Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold">Inventory Management</h4>
              <p className="text-sm text-gray-600">Track and optimize your inventory</p>
            </div>
            <button className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200">
              Manage
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold">Staff Scheduling</h4>
              <p className="text-sm text-gray-600">Optimize your staff roster</p>
            </div>
            <button className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200">
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}