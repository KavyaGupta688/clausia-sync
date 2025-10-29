import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Legal Made Logical
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Keep Your{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Legal Compliance
            </span>{" "}
            in Sync with Your Code
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            Clausia automatically analyzes your product, generates compliant privacy policies, 
            and monitors changes in real-time. No more manual rewrites or compliance gaps.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2 group">
                Start Analyzing
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-muted-foreground">GDPR Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-muted-foreground">Real-time Monitoring</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-muted-foreground">Auto-Generated Policies</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
