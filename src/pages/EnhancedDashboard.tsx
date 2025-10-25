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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadDashboardData(session.user.id);
      }
    });
  }, [navigate]);

  const loadDashboardData = async (userId: string) => {
    try {
      // Load policies
      const { data: policiesData, error: policiesError } = await supabase
        .from('policies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (policiesError) throw policiesError;
      setPolicies(policiesData || []);

      // Load scans
      const { data: scansData, error: scansError } = await supabase
        .from('compliance_scans')
        .select('*')
        .eq('user_id', userId)
        .order('scanned_at', { ascending: false })
        .limit(5);

      if (scansError) throw scansError;
      setScans(scansData || []);

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalIssues = scans.reduce((acc, scan) => {
    const summary = scan.severity_summary || { critical: 0, high: 0, medium: 0, low: 0 };
    return acc + summary.critical + summary.high + summary.medium + summary.low;
  }, 0);

  const activePolicies = policies.filter(p => p.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of your legal compliance status</p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Active
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-1">{activePolicies}</h3>
                <p className="text-sm text-muted-foreground">Active Policies</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                <div className="flex items-center justify-between mb-4">
                  <AlertCircle className="h-8 w-8 text-warning" />
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    Review
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-1">{totalIssues}</h3>
                <p className="text-sm text-muted-foreground">Issues Detected</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <Code className="h-8 w-8 text-primary" />
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Tracked
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-1">{scans.length}</h3>
                <p className="text-sm text-muted-foreground">Scans Completed</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="h-8 w-8 text-accent" />
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    Ready
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-1">8</h3>
                <p className="text-sm text-muted-foreground">Jurisdictions Available</p>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recent Policies</h2>
                  <Link to="/policy-generator">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {policies.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No policies yet. Create your first policy!
                    </p>
                  ) : (
                    policies.map((policy) => (
                      <div key={policy.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                        <div className="mt-1 p-2 rounded-lg bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{policy.product_name}</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {policy.policy_type.replace('_', ' ')}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {policy.jurisdictions?.slice(0, 3).map((j: string) => (
                              <Badge key={j} variant="outline" className="text-xs">{j}</Badge>
                            ))}
                            <span className="text-xs text-muted-foreground">
                              {new Date(policy.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant={policy.status === 'active' ? 'default' : 'outline'}>
                          {policy.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recent Scans</h2>
                  <Link to="/scanner">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {scans.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No scans yet. Run your first scan!
                    </p>
                  ) : (
                    scans.map((scan) => {
                      const summary = scan.severity_summary || { critical: 0, high: 0, medium: 0, low: 0 };
                      const totalFindings = summary.critical + summary.high + summary.medium + summary.low;
                      
                      return (
                        <div key={scan.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                          <div className="mt-1 p-2 rounded-lg bg-accent/10">
                            <Code className="h-4 w-4 text-accent" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium mb-1 capitalize">{scan.scan_type.replace('_', ' ')}</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              Found {totalFindings} issue{totalFindings !== 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-2">
                              {summary.critical > 0 && (
                                <Badge variant="outline" className="text-xs border-destructive text-destructive">
                                  {summary.critical} Critical
                                </Badge>
                              )}
                              {summary.high > 0 && (
                                <Badge variant="outline" className="text-xs border-warning text-warning">
                                  {summary.high} High
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(scan.scanned_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Badge variant={scan.status === 'completed' ? 'default' : 'outline'}>
                            {scan.status}
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/policy-generator">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Generate New Policy
                  </Button>
                </Link>
                <Link to="/scanner">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Code className="h-4 w-4" />
                    Run Scan
                  </Button>
                </Link>
                <Link to="/compliance-mapping">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Globe className="h-4 w-4" />
                    View Mappings
                  </Button>
                </Link>
                <Button variant="outline" className="justify-start gap-2" onClick={() => loadDashboardData(user.id)}>
                  <RefreshCw className="h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default EnhancedDashboard;