import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, LayoutDashboard, FileText, Network, Shield } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
              <Scale className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Clausia
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/dashboard">
              <Button 
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/policy-generator">
              <Button 
                variant={isActive("/policy-generator") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Policy Generator
              </Button>
            </Link>
            <Link to="/compliance-mapping">
              <Button 
                variant={isActive("/compliance-mapping") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Network className="h-4 w-4" />
                Mapping
              </Button>
            </Link>
            <Link to="/scanner">
              <Button 
                variant={isActive("/scanner") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Scanner
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Sign In</Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
