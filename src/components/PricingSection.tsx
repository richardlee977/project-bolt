
import { Check, Star } from 'lucide-react';

export default function PricingSection() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Success Plan</h2>
          <p className="mt-4 text-lg text-gray-600">Unlock powerful tools to grow your restaurant business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Starter</h3>
            <p className="text-gray-600 mt-2">Essential tools to begin</p>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Basic calculators</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Daily tips</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Community access</span>
              </li>
            </ul>
            <button className="mt-8 w-full py-3 px-4 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 transform scale-105">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <span className="bg-white/20 px-3 py-1 rounded-full text-white text-sm">Popular</span>
            </div>
            <p className="text-orange-100 mt-2">Advanced features</p>
            <div className="mt-4">
              <span className="text-4xl font-bold text-white">$29</span>
              <span className="text-orange-100">/month</span>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center text-white">
                <Check className="h-5 w-5 mr-2" />
                <span>All Starter features</span>
              </li>
              <li className="flex items-center text-white">
                <Check className="h-5 w-5 mr-2" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center text-white">
                <Check className="h-5 w-5 mr-2" />
                <span>AI menu optimization</span>
              </li>
              <li className="flex items-center text-white">
                <Check className="h-5 w-5 mr-2" />
                <span>Priority support</span>
              </li>
            </ul>
            <button className="mt-8 w-full py-3 px-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              Start Pro Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-gray-600 mt-2">Multi-location & chains</p>
            <div className="mt-4">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>All Pro features</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Multi-location management</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Dedicated account manager</span>
              </li>
            </ul>
            <button className="mt-8 w-full py-3 px-4 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">All plans include 14-day free trial. No credit card required.</p>
        </div>
      </div>
    </div>
  );
}