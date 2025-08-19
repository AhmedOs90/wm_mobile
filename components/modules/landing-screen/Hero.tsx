import { Button } from "@/components/ui/button";
import TrendingJobs from "./TrendingJobs";
import {
  Search,
  FileText,
  CheckCircle,
} from "lucide-react";
interface HeroProps {
  onSearchClick: () => void;
};
const Hero = ({onSearchClick}:HeroProps) => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Find Your <br />
                <span className="text-primary">Dream Job</span> <br />
                <span className="text-accent">in Egypt & Beyond</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Search thousands of fresh opportunities. Build your CV. Get
                hired.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6"
                  onClick={onSearchClick}
              >
                <Search className="mr-2 h-5 w-5" />
                Search Jobs
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <FileText className="mr-2 h-5 w-5" />
                Create Your Free CV
              </Button>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-accent mr-2" />
                100% Free
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-accent mr-2" />
                AI-powered matching
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-accent mr-2" />
                Instant alerts
              </div>
            </div>
          </div>
         <TrendingJobs/>
        </div>
      </div>
    </section>
  );
};

export default Hero;
