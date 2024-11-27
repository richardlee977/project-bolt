import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  gradient: string;
}

export default function FeatureCard({ title, description, icon: Icon, onClick, gradient }: FeatureCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative group overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100`}
    >
      <div className="absolute inset-0 opacity-75 transition-opacity group-hover:opacity-100" style={{ background: gradient }}></div>
      <div className="relative p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-white/90 p-3 rounded-lg group-hover:scale-110 transition-transform">
            <Icon className="h-6 w-6 text-gray-800" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-white">{title}</h3>
            <p className="text-gray-100 mt-1 group-hover:text-white/90">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}