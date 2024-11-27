import { useState } from 'react';
import {
  Bot, MessageSquare, Share2, 
  Play, Pause, Plus,
  CheckCircle2, Filter,
  Instagram, Facebook, Twitter, Youtube,
  TrendingUp,
  Settings2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';

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
    lastUpdated: string;
  };
  settings: {
    responseTime: number;
    engagementRate: number;
    tone: string;
    languages: string[];
  };
}

export default function AIAgentsDashboard() {
  const { isDarkMode } = useAppStore();
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
        successRate: 94,
        lastUpdated: '2 minutes ago'
      },
      settings: {
        responseTime: 30,
        engagementRate: 85,
        tone: 'Professional',
        languages: ['English', 'Spanish']
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
        successRate: 88,
        lastUpdated: '5 minutes ago'
      },
      settings: {
        responseTime: 0,
        engagementRate: 92,
        tone: 'Casual',
        languages: ['English']
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
        successRate: 91,
        lastUpdated: '15 minutes ago'
      },
      settings: {
        responseTime: 15,
        engagementRate: 78,
        tone: 'Friendly',
        languages: ['English', 'French']
      }
    }
  ]);

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedType] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'paused':
        return 'text-amber-500 bg-amber-500/10';
      case 'error':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-slate-500 bg-slate-500/10';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return Instagram;
      case 'Facebook':
        return Facebook;
      case 'Twitter':
        return Twitter;
      case 'Youtube':
        return Youtube;
      default:
        return Share2;
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

  const filteredAgents = agents.filter(agent => {
    if (selectedPlatform && agent.platform !== selectedPlatform && agent.platform !== 'All Platforms') {
      return false;
    }
    if (selectedType && agent.type !== selectedType) {
      return false;
    }
    return true;
  });

  const totalEngagements = agents.reduce((sum, agent) => sum + agent.performance.engagements, 0);
  const averageSuccessRate = Math.round(
    agents.reduce((sum, agent) => sum + agent.performance.successRate, 0) / agents.length
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border-0 shadow-lg ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-900 to-background' 
            : 'bg-gradient-to-br from-white to-slate-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <h3 className="text-2xl font-bold">{agents.filter(a => a.status === 'active').length}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Bot className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress 
              value={agents.filter(a => a.status === 'active').length / agents.length * 100} 
              className="mt-4"
            />
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-900 to-background' 
            : 'bg-gradient-to-br from-white to-slate-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Engagements</p>
                <h3 className="text-2xl font-bold">{totalEngagements.toLocaleString()}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12.5% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-900 to-background' 
            : 'bg-gradient-to-br from-white to-slate-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <h3 className="text-2xl font-bold">{averageSuccessRate}%</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress value={averageSuccessRate} className="mt-4" />
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedPlatform(null)}
            className={!selectedPlatform ? 'bg-primary/10' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            All Platforms
          </Button>
          {['Instagram', 'Facebook', 'Twitter', 'Youtube'].map(platform => {
            const Icon = getPlatformIcon(platform);
            return (
              <Button
                key={platform}
                variant="outline"
                size="sm"
                onClick={() => setSelectedPlatform(platform)}
                className={selectedPlatform === platform ? 'bg-primary/10' : ''}
              >
                <Icon className="h-4 w-4 mr-2" />
                {platform}
              </Button>
            );
          })}
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Deploy New Agent
        </Button>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className={`border-0 shadow-lg overflow-hidden ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-900 to-background' 
              : 'bg-gradient-to-br from-white to-slate-50'
          }`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Agent Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{agent.platform}</span>
                          <span>•</span>
                          <span>{agent.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
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
                      <Button variant="outline" size="sm">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {agent.tasks.map((task, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {task}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Engagements</p>
                      <p className="font-semibold mt-1">{agent.performance.engagements.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Responses</p>
                      <p className="font-semibold mt-1">{agent.performance.responses.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="font-semibold mt-1">{agent.performance.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Update</p>
                      <p className="font-semibold mt-1">{agent.performance.lastUpdated}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <span className="text-xs text-muted-foreground">
                        Response Time: {agent.settings.responseTime}s
                      </span>
                    </div>
                    <Progress value={agent.performance.successRate} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}