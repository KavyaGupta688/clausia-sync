import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Database, Lock, MapPin, CreditCard, Eye, Loader2, Plus, X, Download, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ComplianceMapping = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [mappings, setMappings] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [policies, setPolicies] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [featureName, setFeatureName] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [dataTypes, setDataTypes] = useState<string[]>([]);
  const [newDataType, setNewDataType] = useState("");
  const [policyClauses, setPolicyClauses] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string>("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadMappings();
        loadPolicies();
      }
    });
  }, [navigate]);

  const loadPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('id, product_name, policy_type')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolicies(data || []);
    } catch (error: any) {
      console.error('Error loading policies:', error);
    }
  };

  const loadMappings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('compliance_mappings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMappings(data || []);
    } catch (error: any) {
      console.error('Error loading mappings:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance mappings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDataType = () => {
    if (newDataType.trim()) {
      setDataTypes([...dataTypes, newDataType.trim()]);
      setNewDataType("");
    }
  };

  const suggestedClauses = [
    "1.1 Information We Collect",
    "1.2 Account Information",
    "1.3 Usage Data",
    "1.4 Location Data",
    "1.5 Payment Data",
    "1.6 Analytics Data",
    "2.1 Service Provision",
    "2.2 Communication",
    "2.3 Location Processing",
    "2.4 Marketing",
    "2.5 Analytics Processing",
    "3.1 Authentication",
    "3.2 Account Management",
    "3.3 Transaction Processing",
    "4.1 Security Measures",
    "4.2 PCI Compliance",
    "4.3 Data Encryption",
    "5.1 Data Retention",
    "5.2 User Rights",
    "5.3 Data Deletion"
  ];

  const handleAddClause = (clause: string) => {
    if (clause && !policyClauses.includes(clause)) {
      setPolicyClauses([...policyClauses, clause]);
    }
  };

  const handleRemoveDataType = (index: number) => {
    setDataTypes(dataTypes.filter((_, i) => i !== index));
  };

  const handleRemoveClause = (index: number) => {
    setPolicyClauses(policyClauses.filter((_, i) => i !== index));
  };

  const handleSaveFlow = async () => {
    if (!featureName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a feature name",
        variant: "destructive",
      });
      return;
    }

    if (dataTypes.length === 0) {
      toast({
        title: "Missing information",
        description: "Please add at least one data type",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('compliance_mappings')
        .insert({
          user_id: user.id,
          feature_name: featureName,
          feature_description: featureDescription || null,
          data_flow: { dataTypes },
          linked_clauses: policyClauses,
          compliance_status: 'compliant'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Data flow mapping added successfully",
      });

      // Reset form
      setFeatureName("");
      setFeatureDescription("");
      setDataTypes([]);
      setPolicyClauses([]);
      setDialogOpen(false);
      
      // Reload mappings
      loadMappings();
    } catch (error: any) {
      console.error('Error saving mapping:', error);
      toast({
        title: "Error",
        description: "Failed to save data flow mapping",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportDiagram = async () => {
    if (!diagramRef.current) return;
    
    setExporting(true);
    try {
      const canvas = await html2canvas(diagramRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `compliance-mapping-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Success!",
        description: "Diagram exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export diagram",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.text('Compliance Mapping Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Date
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Summary Statistics
      pdf.setFontSize(14);
      pdf.text('Summary', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.text(`Total Data Flows: ${mappings.length}`, 20, yPosition);
      yPosition += 7;
      
      const totalClauses = mappings.reduce((acc, m) => acc + (Array.isArray(m.linked_clauses) ? m.linked_clauses.length : 0), 0);
      pdf.text(`Total Policy Clauses Linked: ${totalClauses}`, 20, yPosition);
      yPosition += 15;

      // Data Flow Details
      pdf.setFontSize(14);
      pdf.text('Data Flow Mappings', 20, yPosition);
      yPosition += 10;

      dataFlows.forEach((flow, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.text(`${index + 1}. ${flow.feature}`, 20, yPosition);
        yPosition += 7;

        pdf.setFontSize(10);
        pdf.text(`Data Types: ${flow.dataTypes.join(', ')}`, 25, yPosition);
        yPosition += 7;

        if (flow.clauses.length > 0) {
          pdf.text('Policy Clauses:', 25, yPosition);
          yPosition += 5;
          flow.clauses.forEach((clause) => {
            if (yPosition > 270) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(`  - ${clause}`, 30, yPosition);
            yPosition += 5;
          });
        }
        yPosition += 5;
      });

      // Save PDF
      pdf.save(`compliance-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Success!",
        description: "Compliance report generated successfully",
      });
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const defaultDataFlows = [
    {
      feature: "User Authentication",
      icon: Lock,
      dataTypes: ["Email", "Password Hash"],
      clauses: ["1.2 Account Information", "3.1 Authentication"],
      color: "from-primary/20 to-primary/5"
    },
    {
      feature: "Location Services",
      icon: MapPin,
      dataTypes: ["GPS Coordinates", "IP Address"],
      clauses: ["1.4 Location Data", "2.3 Location Processing"],
      color: "from-secondary/20 to-secondary/5"
    },
    {
      feature: "Payment Processing",
      icon: CreditCard,
      dataTypes: ["Card Details", "Billing Address"],
      clauses: ["1.5 Payment Data", "4.2 PCI Compliance"],
      color: "from-accent/20 to-accent/5"
    },
    {
      feature: "Usage Analytics",
      icon: Eye,
      dataTypes: ["Page Views", "Click Events", "Session Duration"],
      clauses: ["1.6 Analytics Data", "2.5 Analytics Processing"],
      color: "from-warning/20 to-warning/5"
    }
  ];

  const dataFlows = mappings.length > 0 
    ? mappings.map((mapping, idx) => {
        // Parse data_flow JSON which contains data types
        const dataFlow = mapping.data_flow || {};
        const dataTypes = dataFlow.dataTypes || dataFlow.data_types || [];
        
        // Parse linked_clauses which is a JSON array
        const linkedClauses = Array.isArray(mapping.linked_clauses) 
          ? mapping.linked_clauses 
          : (mapping.linked_clauses ? [mapping.linked_clauses] : []);
        
        return {
          feature: mapping.feature_name,
          icon: [Lock, MapPin, CreditCard, Eye][idx % 4],
          dataTypes: Array.isArray(dataTypes) ? dataTypes : [],
          clauses: linkedClauses,
          color: ["from-primary/20 to-primary/5", "from-secondary/20 to-secondary/5", "from-accent/20 to-accent/5", "from-warning/20 to-warning/5"][idx % 4]
        };
      })
    : defaultDataFlows;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Visual Compliance Mapping</h1>
          <p className="text-muted-foreground">
            Interactive visualization of data flows and their corresponding legal clauses
          </p>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-2xl font-bold mb-1">{mappings.length || 24}</div>
            <p className="text-sm text-muted-foreground">Data Flows Mapped</p>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold mb-1">38</div>
            <p className="text-sm text-muted-foreground">Policy Clauses</p>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold mb-1">100%</div>
            <p className="text-sm text-muted-foreground">Coverage</p>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold mb-1">5</div>
            <p className="text-sm text-muted-foreground">Jurisdictions</p>
          </Card>
        </div>
        
        {/* Visual Flow Map */}
        <Card className="p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Data Flow Overview
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="relative" ref={diagramRef}>
              {/* Central Database Node */}
              <div className="flex justify-center mb-12">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <Database className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <Badge variant="secondary">Core Database</Badge>
                  </div>
                </div>
              </div>
              
              {/* Feature Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dataFlows.map((flow, index) => {
                  const Icon = flow.icon;
                  return (
                    <Card 
                      key={index}
                      className={`p-6 bg-gradient-to-br ${flow.color} border-border hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-background/50">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">{flow.feature}</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Data Types</p>
                          <div className="flex flex-wrap gap-1">
                            {flow.dataTypes.map((type, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Linked Clauses</p>
                          <div className="space-y-1">
                            {flow.clauses.map((clause, idx) => (
                              <p key={idx} className="text-xs bg-background/50 rounded px-2 py-1">
                                {clause}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
        
        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={handleExportDiagram}
            disabled={exporting || loading}
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Diagram
              </>
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={handleGenerateReport}
            disabled={generating || loading}
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add New Flow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Data Flow Mapping</DialogTitle>
                <DialogDescription>
                  Map your application feature to the data it collects and the policy clauses that cover it.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Feature Name */}
                <div className="space-y-2">
                  <Label htmlFor="feature-name">Feature Name *</Label>
                  <Input
                    id="feature-name"
                    placeholder="e.g., User Registration, Payment Checkout"
                    value={featureName}
                    onChange={(e) => setFeatureName(e.target.value)}
                  />
                </div>

                {/* Feature Description */}
                <div className="space-y-2">
                  <Label htmlFor="feature-description">Feature Description</Label>
                  <Textarea
                    id="feature-description"
                    placeholder="Describe what this feature does..."
                    value={featureDescription}
                    onChange={(e) => setFeatureDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Data Types */}
                <div className="space-y-2">
                  <Label>Data Types Collected *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Email, Password, Credit Card"
                      value={newDataType}
                      onChange={(e) => setNewDataType(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddDataType()}
                    />
                    <Button type="button" onClick={handleAddDataType}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {dataTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dataTypes.map((type, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {type}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveDataType(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Policy Clauses */}
                <div className="space-y-2">
                  <Label>Link to Policy Clauses (Select from Common Clauses)</Label>
                  <Select onValueChange={handleAddClause} value="">
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a policy clause to add..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {suggestedClauses.map((clause) => (
                        <SelectItem key={clause} value={clause}>
                          {clause}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select which sections of your privacy policy cover this data collection
                  </p>
                  {policyClauses.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {policyClauses.map((clause, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                          <span className="flex-1">{clause}</span>
                          <X
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => handleRemoveClause(index)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveFlow} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Flow'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default ComplianceMapping;
