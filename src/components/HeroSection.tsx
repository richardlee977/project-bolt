import { ChefHat, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
      </div>
      
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-10 w-10 text-orange-400" />
              <span className="text-2xl font-bold text-white">RestaurantPro</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Your Personal Guide to Restaurant Success
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Join thousands of restaurant owners who've transformed their business with our expert tools and guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold backdrop-blur-sm transition-all">
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}