import { useState } from 'react';
import { Flame, Trophy, Plus, X } from 'lucide-react';
import { useReward } from 'react-rewards';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';


export default function CombinedInsights() {
  const [streak] = useState(5);
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review inventory levels", completed: false },
    { id: 2, text: "Check staff schedule", completed: false },
    { id: 3, text: "Update social media", completed: false }
  ]);
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const { reward: rewardConfetti } = useReward('rewardId', 'confetti');
  const { toast } = useToast();

  const addTask = (text: string) => {
    if (text.trim()) {
      setTasks([...tasks, { id: Date.now(), text, completed: false }]);
      setNewTaskText('');
      setShowNewTaskInput(false);
      toast({
        title: "Task Added",
        description: "New task has been added to your list.",
      });
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          toast({
            title: "Task Completed! 🎉",
            description: "Keep up the great work!",
          });
          rewardConfetti();
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task Removed",
      description: "Task has been removed from your list.",
      variant: "destructive",
    });
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daily Progress</CardTitle>
            <CardDescription>Keep your business growing!</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-lg font-semibold">{streak} day streak</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Progress</h3>
              <span className="text-sm text-muted-foreground">
                {completedTasks} of {tasks.length} tasks
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Today's Tasks</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewTaskInput(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>

            {showNewTaskInput && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Enter new task..."
                  className="flex-1 p-2 border rounded-md"
                  onKeyPress={(e) => e.key === 'Enter' && addTask(newTaskText)}
                />
                <Button size="sm" onClick={() => addTask(newTaskText)}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowNewTaskInput(false)}
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg group hover:bg-muted/70"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                      {task.text}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTask(task.id)}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {completedTasks === tasks.length && tasks.length > 0 && (
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                <Trophy className="h-5 w-5" />
                <span className="font-medium">All tasks completed!</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}