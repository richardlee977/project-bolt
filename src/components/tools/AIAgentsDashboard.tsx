import { useState } from 'react';
import {
  Bot, MessageSquare, 
  Play, Pause, 
  CheckCircle2, 
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  platform: string;
  tasks: string[];
  performance: {
    engagements: number;
    responses: number;
    successRate: number;
  };
}

export default function AIAgentsDashboard() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Customer Service Bot',
      type: 'Support',
      status: 'active',
      platform: 'All Platforms',
      tasks: ['Reply to comments', 'Handle DMs', 'FAQ responses'],
      performance: {
        engagements: 1250,
        responses: 980,
        successRate: 94
      }
    },
    {
      id: '2',
      name: 'Content Scheduler',
      type: 'Content',
      status: 'active',
      platform: 'Instagram',
      tasks: ['Schedule posts', 'Optimize timing', 'Track performance'],
      performance: {
        engagements: 3400,
        responses: 2800,
        successRate: 88
      }
    },
    {
      id: '3',
      name: 'Engagement Bot',
      type: 'Engagement',
      status: 'paused',
      platform: 'Twitter',
      tasks: ['Like posts', 'Follow users', 'Retweet content'],
      performance: {
        engagements: 5600,
        responses: 4200,
        successRate: 91
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        return {
          ...agent,
          status: agent.status === 'active' ? 'paused' : 'active'
        };
      }
      return agent;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Agents</h2>
          <p className="text-muted-foreground">Manage your automated social media assistants</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <h3 className="text-2xl font-bold">{agents.filter(a => a.status === 'active').length}</h3>
              </div>
              <Bot className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Engagements</p>
                <h3 className="text-2xl font-bold">
                  {agents.reduce((sum, agent) => sum + agent.performance.engagements, 0).toLocaleString()}
                </h3>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <h3 className="text-2xl font-bold">
                  {Math.round(agents.reduce((sum, agent) => sum + agent.performance.successRate, 0) / agents.length)}%
                </h3>
              </div>
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Agents</CardTitle>
          <CardDescription>Monitor and manage your AI assistants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">{agent.platform}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAgentStatus(agent.id)}
                    >
                      {agent.status === 'active' ? (
                        <Pause className="h-4 w-4 mr-2" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      {agent.status === 'active' ? 'Pause' : 'Start'}
                    </Button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Engagements</p>
                      <p className="font-medium">{agent.performance.engagements.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Responses</p>
                      <p className="font-medium">{agent.performance.responses.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="font-medium">{agent.performance.successRate}%</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Tasks</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.tasks.map((task, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {task}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(agent.status)}`}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                    </div>
                    <Progress value={agent.performance.successRate} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}