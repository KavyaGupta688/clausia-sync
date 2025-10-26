import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, CheckCircle2, Chrome, Play, Loader2, Code } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Scanner = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [codeInput, setCodeInput] = useState("");
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [severitySummary, setSeveritySummary] = useState({ critical: 0, high: 0, medium: 0, low: 0 });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadRecentScans();
      }
    });
  }, [navigate]);

  const loadRecentScans = async () => {
    try {
      const { data, error } = await supabase
        .from('compliance_scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const latestScan = data[0];
        setScanResults(Array.isArray(latestScan.findings) ? latestScan.findings : []);
        const summary = latestScan.severity_summary as any;
        setSeveritySummary(
          summary && typeof summary === 'object' 
            ? summary 
            : { critical: 0, high: 0, medium: 0, low: 0 }
        );
      }
    } catch (error: any) {
      console.error('Error loading scans:', error);
    }
  };

  const runScan = async (scanType: 'code_scan' | 'live_scan') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to run scans",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (scanType === 'code_scan' && !codeInput.trim()) {
      toast({
        title: "Missing input",
        description: "Please provide code, URL, or product description to scan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('run-compliance-scan', {
        body: {
          scanType,
          codeContext: codeInput,
        },
      });

      if (error) throw error;

      setScanResults(data.findings || []);
      setSeveritySummary(data.severitySummary || { critical: 0, high: 0, medium: 0, low: 0 });
      
      toast({
        title: "Scan Complete!",
        description: `Found ${data.findings?.length || 0} items`,
      });

      await loadRecentScans();
    } catch (error: any) {
      console.error('Scan error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to run scan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
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
        
        {/* Input Area */}
        <Card className="p-6 mb-8">
          <Tabs defaultValue="code">
            <TabsList className="mb-4">
              <TabsTrigger value="code">Code/URL Scan</TabsTrigger>
              <TabsTrigger value="live">Live Website Scan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="code">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code-input">Enter Code, Website URL, or Product Description</Label>
                  <Textarea 
                    id="code-input"
                    placeholder="Paste your code snippet, enter a website URL, or describe your product's data handling practices..."
                    className="mt-2 min-h-[150px] font-mono text-sm"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => runScan('code_scan')}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Code className="h-4 w-4" />
                      Run Code Scan
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="live">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Perform a live scan of your running application to check for real-time compliance issues.
                </p>
                <Button 
                  onClick={() => runScan('live_scan')}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Live Scan
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        
        {/* Scan Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border-destructive/20 bg-destructive/5">
            <div className="text-2xl font-bold text-destructive mb-1">{severitySummary.critical}</div>
            <p className="text-sm text-muted-foreground">Critical Issues</p>
          </Card>
          <Card className="p-4 border-warning/20 bg-warning/5">
            <div className="text-2xl font-bold text-warning mb-1">{severitySummary.high}</div>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </Card>
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="text-2xl font-bold text-primary mb-1">{severitySummary.medium}</div>
            <p className="text-sm text-muted-foreground">Medium Priority</p>
          </Card>
          <Card className="p-4 border-success/20 bg-success/5">
            <div className="text-2xl font-bold text-success mb-1">{severitySummary.low}</div>
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
              <a href="/chrome-extension/clausia-extension.zip" download>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <Chrome className="h-4 w-4 mr-2" />
                  Download Extension
                </Button>
              </a>
            </div>
          </div>
        </Card>
        
        {/* Scan Results */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Scan Results</h2>
          
          <div className="space-y-4">
            {scanResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No scan results yet. Run a scan to see compliance findings.</p>
              </div>
            ) : (
              scanResults.map((result, index) => {
                const getSeverityStyles = (severity: string) => {
                  const normalized = severity.toLowerCase();
                  if (normalized === "critical") {
                    return {
                      icon: AlertTriangle,
                      iconColor: "text-destructive",
                      bgColor: "bg-destructive/10",
                      badgeClass: "border-destructive text-destructive"
                    };
                  } else if (normalized === "high") {
                    return {
                      icon: AlertTriangle,
                      iconColor: "text-warning",
                      bgColor: "bg-warning/10",
                      badgeClass: "border-warning text-warning"
                    };
                  } else if (normalized === "medium") {
                    return {
                      icon: AlertTriangle,
                      iconColor: "text-primary",
                      bgColor: "bg-primary/10",
                      badgeClass: "border-primary text-primary"
                    };
                  } else {
                    return {
                      icon: CheckCircle2,
                      iconColor: "text-success",
                      bgColor: "bg-success/10",
                      badgeClass: "border-success text-success"
                    };
                  }
                };

                const styles = getSeverityStyles(result.severity);
                const Icon = styles.icon;
                
                return (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                  >
                    <div className={`mt-1 p-2 rounded-lg ${styles.bgColor}`}>
                      <Icon className={`h-5 w-5 ${styles.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{result.title}</h3>
                        <Badge variant="outline" className={styles.badgeClass}>
                          {result.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {result.description}
                      </p>
                      {result.location && (
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {result.location}
                        </code>
                      )}
                      {result.recommendation && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <strong>Fix:</strong> {result.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Scanner;
