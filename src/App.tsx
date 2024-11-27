import Navbar from './components/Navbar';
import StageBasedDashboard from './components/StageBasedDashboard';
import AIAgentsDashboard from './components/AIAgentsDashboard';
import YouTubeSection from './components/YouTubeSection';
import { BusinessStage, stageDescriptions } from './types/business';
import { TaskProvider } from './context/TaskContext';
import { Toaster } from './components/Toaster';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Bot, ChefHat, ArrowRight, Settings, Command } from 'lucide-react';
import DailyInsights from './components/DailyInsights';
import { useAppStore } from './store/useAppStore';

function App() {
  const { 
    businessStage, 
    showAIAgents, 
    setBusinessStage, 
    setShowAIAgents,
    isDarkMode 
  } = useAppStore();

  return (
    <TaskProvider>
      <div className={`min-h-screen ${
        isDarkMode 
          ? 'bg-gradient-to-br from-background via-background to-slate-900/50'
          : 'bg-gradient-to-br from-slate-50 via-slate-50 to-cyan-50/20'
      }`}>
        <Navbar />
        
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mode Selection Card */}
            <Card className={`mb-8 border-0 shadow-lg ${
              isDarkMode
                ? 'bg-gradient-to-br from-slate-900 via-background to-slate-900/50'
                : 'bg-gradient-to-br from-white via-slate-50 to-cyan-50'
            }`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Command className="h-6 w-6 text-primary" />
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Restaurant OS
                      </h1>
                    </div>
                    <p className="text-muted-foreground">
                      Mode: <span className="font-medium text-foreground">
                        {showAIAgents ? 'AI-Powered Management' : 'Business Journey'}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant={!showAIAgents ? "default" : "outline"}
                      onClick={() => setShowAIAgents(false)}
                      className={`flex items-center gap-2 ${
                        !showAIAgents 
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700' 
                          : 'hover:bg-accent'
                      }`}
                      size="lg"
                    >
                      <ChefHat className="h-5 w-5" />
                      Business Journey
                    </Button>
                    <Button
                      variant={showAIAgents ? "default" : "outline"}
                      onClick={() => setShowAIAgents(true)}
                      className={`flex items-center gap-2 ${
                        showAIAgents 
                          ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 border-0' 
                          : 'hover:bg-accent'
                      }`}
                      size="lg"
                    >
                      <Bot className="h-5 w-5" />
                      AI Agents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Insights Sidebar */}
              <div className="lg:col-span-1">
                <DailyInsights />
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-2">
                {!showAIAgents ? (
                  <>
                    <Card className={`mb-6 border-0 shadow-lg ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-slate-900 to-background'
                        : 'bg-gradient-to-br from-white to-slate-50'
                    }`}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Business Stage
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                        </CardTitle>
                        <CardDescription>Select your current business stage</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(Object.keys(stageDescriptions) as BusinessStage[]).map((stage) => (
                            <Button
                              key={stage}
                              variant={businessStage === stage ? "default" : "outline"}
                              className={`w-full justify-start h-auto p-4 ${
                                businessStage === stage 
                                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-primary-foreground' 
                                  : 'hover:bg-accent border-border'
                              }`}
                              onClick={() => setBusinessStage(stage)}
                            >
                              <div className="text-left">
                                <h3 className="font-semibold capitalize">{stage}</h3>
                                <p className={`text-sm mt-1 ${
                                  businessStage === stage 
                                    ? 'text-primary-foreground/80' 
                                    : 'text-muted-foreground'
                                }`}>
                                  {stageDescriptions[stage]}
                                </p>
                              </div>
                              {businessStage === stage && (
                                <ArrowRight className="h-4 w-4 ml-auto" />
                              )}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <StageBasedDashboard stage={businessStage} />
                  </>
                ) : (
                  <AIAgentsDashboard />
                )}
              </div>
            </div>
          </div>
        </div>

        <YouTubeSection />
      </div>
      <Toaster />
    </TaskProvider>
  );
}

export default App;