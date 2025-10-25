import { Card } from "@/components/ui/card";
import { Code, Zap, FileCheck, Shield } from "lucide-react";

const steps = [
  {
    icon: Code,
    number: "01",
    title: "Connect Your Codebase",
    description: "Integrate with GitHub, GitLab, or upload your project. We analyze your code structure, APIs, and data flows."
  },
  {
    icon: Zap,
    number: "02",
    title: "AI Analysis & Generation",
    description: "Our AI scans your codebase for data collection patterns, third-party integrations, and compliance requirements."
  },
  {
    icon: FileCheck,
    number: "03",
    title: "Policy Generation",
    description: "Receive jurisdiction-specific privacy policies and terms of service, perfectly aligned with your product."
  },
  {
    icon: Shield,
    number: "04",
    title: "Continuous Monitoring",
    description: "Stay compliant with automated monitoring, real-time alerts, and policy updates as your code evolves."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From code integration to continuous compliance in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-secondary opacity-30" />
                )}
                <Card className="relative p-6 h-full bg-card/50 backdrop-blur-sm border-border hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-primary to-secondary mb-3">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="text-5xl font-bold text-primary/10 absolute top-4 right-4">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
