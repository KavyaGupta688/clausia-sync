import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle2, Chrome, Play } from "lucide-react";

const Scanner = () => {
  const scanResults = [
    {
      type: "success",
      title: "Cookie consent properly implemented",
      description: "All cookies have user consent before being set",
      severity: "Low",
      file: "src/utils/cookies.ts"
    },
    {
      type: "warning",
      title: "Unencrypted location data transmission",
      description: "Location coordinates sent without HTTPS encryption",
      severity: "High",
      file: "src/api/location.ts"
    },
    {
      type: "error",
      title: "Missing data retention policy",
      description: "User data stored indefinitely without cleanup schedule",
      severity: "Critical",
      file: "src/database/users.ts"
    },
    {
      type: "warning",
      title: "Third-party API without privacy disclosure",
      description: "OpenAI integration not mentioned in privacy policy",
      severity: "Medium",
      file: "src/services/ai.ts"
    },
    {
      type: "success",
      title: "Proper authentication implementation",
      description: "Password hashing and secure session management in place",
      severity: "Low",
      file: "src/auth/login.ts"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Live Compliance Scanner</h1>
          <p className="text-muted-foreground">
            Real-time detection of compliance issues in your codebase
          </p>
        </div>
        
        {/* Scanner Status */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Scanner Active</h2>
                <p className="text-sm text-muted-foreground">
                  Monitoring your codebase for compliance issues
                </p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2">
              <Play className="h-4 w-4" />
              Run Full Scan
            </Button>
          </div>
        </Card>
        
        {/* Scan Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border-destructive/20 bg-destructive/5">
            <div className="text-2xl font-bold text-destructive mb-1">1</div>
            <p className="text-sm text-muted-foreground">Critical Issues</p>
          </Card>
          <Card className="p-4 border-warning/20 bg-warning/5">
            <div className="text-2xl font-bold text-warning mb-1">2</div>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </Card>
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="text-2xl font-bold text-primary mb-1">1</div>
            <p className="text-sm text-muted-foreground">Medium Priority</p>
          </Card>
          <Card className="p-4 border-success/20 bg-success/5">
            <div className="text-2xl font-bold text-success mb-1">2</div>
            <p className="text-sm text-muted-foreground">Passed Checks</p>
          </Card>
        </div>
        
        {/* Chrome Extension Info */}
        <Card className="p-6 mb-8 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-accent/20">
              <Chrome className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Chrome DevTools Extension Available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Install our Chrome extension to detect compliance issues in real-time during development. 
                Monitor cookies, API calls, and data collection as you build.
              </p>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Install Extension
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Scan Results */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Scan Results</h2>
          
          <div className="space-y-4">
            {scanResults.map((result, index) => {
              const Icon = result.type === "success" ? CheckCircle2 : 
                          result.type === "warning" ? AlertTriangle : AlertTriangle;
              const iconColor = result.type === "success" ? "text-success" : 
                              result.type === "warning" ? "text-warning" : "text-destructive";
              const bgColor = result.type === "success" ? "bg-success/10" : 
                            result.type === "warning" ? "bg-warning/10" : "bg-destructive/10";
              
              return (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                >
                  <div className={`mt-1 p-2 rounded-lg ${bgColor}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{result.title}</h3>
                      <Badge 
                        variant="outline"
                        className={
                          result.severity === "Critical" ? "border-destructive text-destructive" :
                          result.severity === "High" ? "border-warning text-warning" :
                          result.severity === "Medium" ? "border-primary text-primary" :
                          "border-success text-success"
                        }
                      >
                        {result.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {result.description}
                    </p>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {result.file}
                    </code>
                  </div>
                  <Button variant="outline" size="sm">
                    Fix Issue
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Scanner;
