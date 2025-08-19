import { Button } from "@/components/ui/button";
import { ArrowRight, Search, FileText } from "lucide-react";
interface FinalCtaProps {
  onSearchClick: () => void;
}
const FinalCta = ({ onSearchClick }: FinalCtaProps) => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Your Next Job Is Waiting
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of professionals who found their perfect role through
          WazifaME.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
            onClick={onSearchClick}
          >
            <Search className="mr-2 h-5 w-5" />
            Start Your Search
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-white text-primary/70 hover:bg-white hover:text-primary"
          >
            <FileText className="mr-2 h-5 w-5" />
            Create Your CV
          </Button>
        </div>
        <p className="mt-6 text-sm opacity-75">
          Free, fast, and personalized. Start today!
        </p>
      </div>
    </section>
  );
};

export default FinalCta;
