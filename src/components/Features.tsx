import { Card } from "@/components/ui/card";
import { 
  FileSearch, 
  Sparkles, 
  Bell, 
  FileEdit, 
  Chrome, 
  CheckSquare,
  Network,
  Globe
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "AutoPolicy Match",
    description: "Automatically compares real-time app behavior with policy documentation using AI-powered analysis."
  },
  {
    icon: Sparkles,
    title: "Smart Clause Writer",
    description: "Generate legally compliant clauses customized to your features and jurisdiction using GPT-4."
  },
  {
    icon: Bell,
    title: "Policy Drift Watchdog",
    description: "Monitors code changes via CI/CD hooks and flags when new features require policy updates."
  },
  {
    icon: FileEdit,
    title: "Contract Shift Analyzer",
    description: "Tracks third-party vendor policy changes and alerts you when updates affect your compliance."
  },
  {
    icon: Chrome,
    title: "Live Compliance Scanner",
    description: "Chrome extension that detects risky data behaviors during development and testing."
  },
  {
    icon: CheckSquare,
    title: "Legal Launch Checklist",
    description: "Dynamic compliance checklist based on your app structure and target jurisdictions."
  },
  {
    icon: Network,
    title: "Visual Compliance Mapping",
    description: "Interactive flowcharts mapping app data flows to specific legal clauses."
  },
  {
    icon: Globe,
    title: "Multi-Jurisdiction Support",
    description: "Stay compliant with GDPR, CCPA, DPDP, LGPD, and more with region-specific policies."
  }
];

const Features = () => {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Comprehensive Compliance Automation
          </h2>
          <p className="text-lg text-muted-foreground">
            Nine powerful features working together to keep your legal documentation 
            synchronized with your product evolution.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card/50 backdrop-blur-sm"
              >
                <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
