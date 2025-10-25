import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Copy, Download, FileText } from "lucide-react";
import { useState } from "react";

const PolicyGenerator = () => {
  const [generated, setGenerated] = useState(false);
  
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
                />
              </div>
              
              <div>
                <Label htmlFor="description">Product Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe what your product does and what data it processes..."
                  className="mt-2 min-h-[100px]"
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
                      <Checkbox id={item} />
                      <label
                        htmlFor={item}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                  {["GDPR (EU)", "CCPA (CA)", "DPDP (India)", "LGPD (Brazil)", "PIPEDA (Canada)"].map((jurisdiction) => (
                    <Badge 
                      key={jurisdiction}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
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
                />
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2"
                onClick={() => setGenerated(true)}
              >
                <Sparkles className="h-4 w-4" />
                Generate Policy
              </Button>
            </div>
          </Card>
          
          {/* Generated Output */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Generated Policy</h2>
              {generated && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
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
                <div className="bg-muted/50 rounded-lg p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Privacy Policy</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Last Updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  
                  <section>
                    <h4 className="font-semibold mb-2">1. Information We Collect</h4>
                    <p className="text-sm text-muted-foreground">
                      We collect information that you provide directly to us, including email addresses, 
                      location data, and device information. This data is processed in accordance with 
                      applicable data protection regulations including GDPR, CCPA, and DPDP.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="font-semibold mb-2">2. How We Use Your Information</h4>
                    <p className="text-sm text-muted-foreground">
                      We use the collected information to provide, maintain, and improve our services, 
                      process transactions, send communications, and ensure security. Your data is never 
                      sold to third parties.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="font-semibold mb-2">3. Data Storage and Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Your data is stored securely using industry-standard encryption. We implement 
                      appropriate technical and organizational measures to protect against unauthorized 
                      access, alteration, or destruction.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="font-semibold mb-2">4. Third-Party Services</h4>
                    <p className="text-sm text-muted-foreground">
                      We integrate with trusted third-party services including Google Analytics for 
                      usage analytics, Stripe for payment processing, and OpenAI for AI-powered features. 
                      Each service adheres to strict privacy standards.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="font-semibold mb-2">5. Your Rights</h4>
                    <p className="text-sm text-muted-foreground">
                      You have the right to access, correct, delete, or export your personal data. 
                      You may also object to processing or withdraw consent at any time. Contact us 
                      at privacy@example.com to exercise these rights.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="font-semibold mb-2">6. Data Retention</h4>
                    <p className="text-sm text-muted-foreground">
                      We retain personal data only for as long as necessary to fulfill the purposes 
                      outlined in this policy, comply with legal obligations, resolve disputes, and 
                      enforce agreements.
                    </p>
                  </section>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      This policy was automatically generated by Clausia AI and tailored to your 
                      product's specific data practices and applicable jurisdictions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PolicyGenerator;
