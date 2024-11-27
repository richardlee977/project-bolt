import { Flame, Trophy } from 'lucide-react';
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Confetti from 'react-confetti';
import { useReward } from 'react-rewards';

export default function StreakTracker() {
  const [streak] = React.useState(5);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const { reward: rewardConfetti } = useReward('rewardId', 'confetti');

  const streakProgress = (streak % 7) / 7 * 100;
  const isStreakMilestone = streak > 0 && streak % 7 === 0;

  React.useEffect(() => {
    if (isStreakMilestone) {
      setShowConfetti(true);
      rewardConfetti();
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [streak, rewardConfetti]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Daily Streak</h2>
          <p className="text-gray-600">Keep improving your business!</p>
        </div>
        <div className="w-16 h-16">
          <CircularProgressbar
            value={streakProgress}
            text={`${streak}d`}
            styles={buildStyles({
              pathColor: '#f97316',
              textColor: '#1f2937',
              trailColor: '#f3f4f6',
            })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Current Streak</p>
              <p className="text-sm text-gray-600">{streak} days</p>
            </div>
          </div>
          <span id="rewardId" />
        </div>

        <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Next Milestone</p>
              <p className="text-sm text-gray-600">{7 - (streak % 7)} days to go</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-800 mb-3">Today's Tasks</h3>
          <div className="space-y-2">
            {[
              { task: "Update daily numbers", reward: "+1 point" },
              { task: "Check inventory", reward: "+1 point" },
              { task: "Review staff schedule", reward: "+1 point" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-700">{item.task}</span>
                </div>
                <span className="text-sm text-orange-600 font-medium">{item.reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}