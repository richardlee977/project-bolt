import { format } from 'date-fns';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import IndustryIntelligence from './IndustryIntelligence';
import { useAppStore } from '@/store/useAppStore';

export default function DailyInsights() {
  const { isDarkMode } = useAppStore();
  const today = format(new Date(), 'EEEE, MMMM d');
  const completionRate = 0;

  return (
    <div className="space-y-6">
      <div className={`rounded-xl shadow-lg p-6 border-0 ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 to-background'
          : 'bg-gradient-to-br from-white to-slate-50'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Daily Overview</h2>
            <p className="text-muted-foreground">{today}</p>
          </div>
          <div className="w-16 h-16">
            <CircularProgressbar
              value={completionRate}
              text={`${completionRate}%`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: 'hsl(var(--primary))',
                textColor: 'hsl(var(--foreground))',
                trailColor: 'hsl(var(--muted))',
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-accent/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Goal</p>
                <p className="font-semibold">Review inventory levels</p>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staff Management</p>
                <p className="font-semibold">Schedule review due</p>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue Tracker</p>
                <p className="text-primary font-semibold">+12.5% this week</p>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Event</p>
                <p className="font-semibold">Weekend promotion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Intelligence Section */}
      <IndustryIntelligence />
    </div>
  );
}