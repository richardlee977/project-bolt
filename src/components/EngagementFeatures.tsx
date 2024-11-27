import { useState } from 'react';
import { Trophy, Flame, Gift } from 'lucide-react';
import Confetti from 'react-confetti';

export default function EngagementFeatures() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak] = useState(5);

  const triggerReward = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
        
        {/* Daily Streak */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Daily Streak</h3>
                <p className="text-sm text-gray-600">{streak} days strong!</p>
              </div>
            </div>
            <div className="flex space-x-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < streak ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h3 className="font-semibold text-gray-800">Recent Achievements</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Menu Master', progress: 80 },
              { title: 'Cost Controller', progress: 60 },
              { title: 'Marketing Guru', progress: 40 },
              { title: 'Team Leader', progress: 90 }
            ].map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3"
                      strokeDasharray={`${achievement.progress}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                    {achievement.progress}%
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600">{achievement.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Gift className="h-6 w-6 text-purple-500" />
            <h3 className="font-semibold text-gray-800">Rewards Available</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Premium Template Pack', points: 500 },
              { title: '1-on-1 Consultation', points: 1000 },
              { title: 'Featured Restaurant Story', points: 750 }
            ].map((reward, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 cursor-pointer transition-colors"
                onClick={triggerReward}
              >
                <h4 className="font-medium text-gray-800">{reward.title}</h4>
                <p className="text-sm text-orange-600">{reward.points} points</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}