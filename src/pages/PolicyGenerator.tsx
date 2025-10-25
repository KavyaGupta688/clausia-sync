import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Copy, Download, FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const PolicyGenerator = () => {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [thirdParty, setThirdParty] = useState("");
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  const toggleDataType = (dataType: string) => {
    setSelectedDataTypes(prev => 
      prev.includes(dataType) 
        ? prev.filter(dt => dt !== dataType)
        : [...prev, dataType]
    );
  };

  const toggleJurisdiction = (jurisdiction: string) => {
    setSelectedJurisdictions(prev =>
      prev.includes(jurisdiction)
        ? prev.filter(j => j !== jurisdiction)
        : [...prev, jurisdiction]
    );
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate policies",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!productName || selectedDataTypes.length === 0 || selectedJurisdictions.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in product name, select data types and jurisdictions",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-policy', {
        body: {
          productName,
          productDescription: description,
          dataTypes: selectedDataTypes,
          jurisdictions: selectedJurisdictions,
          thirdPartyServices: thirdParty,
        },
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      setGenerated(true);
      
      toast({
        title: "Success!",
        description: "Privacy policy generated successfully",
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate policy",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied!",
      description: "Policy copied to clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName}-privacy-policy.html`;
    a.click();
    toast({
      title: "Downloaded!",
      description: "Policy downloaded successfully",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Smart Policy Generator</h1>
          <p className="text-muted-foreground">
            AI-powered privacy policy and terms of service generation
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Product Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="product-name">Product Name</Label>
                <Input 
                  id="product-name" 
                  placeholder="e.g., MyApp" 
                  className="mt-2"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Product Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe what your product does and what data it processes..."
                  className="mt-2 min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Data Types Collected</Label>
                <div className="mt-3 space-y-3">
                  {[
                    "Email addresses",
                    "Location data",
                    "Payment information",
                    "Biometric data",
                    "Device information",
                    "Usage analytics"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox 
                        id={item} 
                        checked={selectedDataTypes.includes(item)}
                        onCheckedChange={() => toggleDataType(item)}
                      />
                      <label
                        htmlFor={item}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Target Jurisdictions</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "GDPR", "CCPA", "DPDP", "LGPD", "PIPEDA", 
                    "PDPA", "APPI", "POPIA"
                  ].map((jurisdiction) => (
                    <Badge 
                      key={jurisdiction}
                      variant={selectedJurisdictions.includes(jurisdiction) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => toggleJurisdiction(jurisdiction)}
                    >
                      {jurisdiction}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="third-party">Third-Party Services</Label>
                <Input 
                  id="third-party" 
                  placeholder="e.g., Google Analytics, Stripe, OpenAI"
                  className="mt-2"
                  value={thirdParty}
                  onChange={(e) => setThirdParty(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Policy
                  </>
                )}
              </Button>
            </div>
          </Card>
          
          {/* Generated Output */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Generated Policy</h2>
              {generated && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {!generated ? (
              <div className="flex flex-col items-center justify-center h-[600px] text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Fill out the form and click "Generate Policy" to create your custom privacy policy
                </p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div 
                  className="bg-muted/50 rounded-lg p-6 space-y-4 max-h-[600px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: generatedContent }}
                />
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PolicyGenerator;
