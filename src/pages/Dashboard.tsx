import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  FileText,
  Code,
  Globe,
  RefreshCw
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of your legal compliance status</p>
        </div>
        
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Active
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">98%</h3>
            <p className="text-sm text-muted-foreground">Policy Coverage</p>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="h-8 w-8 text-warning" />
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                Review
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">3</h3>
            <p className="text-sm text-muted-foreground">Policy Drifts Detected</p>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <Code className="h-8 w-8 text-primary" />
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Synced
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">127</h3>
            <p className="text-sm text-muted-foreground">Code Changes Tracked</p>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <Globe className="h-8 w-8 text-accent" />
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                Compliant
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">5</h3>
            <p className="text-sm text-muted-foreground">Jurisdictions Covered</p>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Policy Updates</h2>
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-border">
                <div className="mt-1 p-2 rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Location tracking clause added</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    New geolocation API detected in feature/maps branch
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">GDPR</Badge>
                    <Badge variant="outline" className="text-xs">CCPA</Badge>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 pb-4 border-b border-border">
                <div className="mt-1 p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Cookie consent updated</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Analytics integration policy synchronized
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">EU ePrivacy</Badge>
                    <span className="text-xs text-muted-foreground">5 hours ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-lg bg-warning/10">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Third-party ToS change detected</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    OpenAI updated data processing terms
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Action Required</Badge>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Compliance Score Trend</h2>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Compliance</span>
                <span className="text-2xl font-bold text-success">98%</span>
              </div>
              <Progress value={98} className="h-3" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">GDPR Compliance</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">CCPA Compliance</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">DPDP Compliance</span>
                  <span className="text-sm font-medium">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span>+3% improvement this month</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start gap-2">
              <FileText className="h-4 w-4" />
              Generate New Policy
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Code className="h-4 w-4" />
              Scan Codebase
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <AlertCircle className="h-4 w-4" />
              Review Alerts
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Globe className="h-4 w-4" />
              Add Jurisdiction
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
