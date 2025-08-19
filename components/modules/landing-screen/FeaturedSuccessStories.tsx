import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Star } from "lucide-react";
const FeaturedSuccessStories = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real professionals who found their dream jobs through WazifaME
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Sarah Ahmed</CardTitle>
                  <CardDescription>Software Engineer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Found my dream job at a tech startup in just 2 weeks! The AI
                matching was spot-on and connected me with the perfect role."
              </p>
              <div className="flex items-center justify-between text-sm">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  Frontend Developer
                </Badge>
                <span className="text-muted-foreground">Cairo</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mohamed Hassan</CardTitle>
                  <CardDescription>Marketing Manager</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The CV builder helped me create a professional profile that
                stood out. Got 5 interview calls in the first week!"
              </p>
              <div className="flex items-center justify-between text-sm">
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  Digital Marketing
                </Badge>
                <span className="text-muted-foreground">Alexandria</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Fatima El-Sharif</CardTitle>
                  <CardDescription>Data Analyst</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Landed a remote position with a European company through
                WazifaME. The platform opened doors I never knew existed!"
              </p>
              <div className="flex items-center justify-between text-sm">
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-600"
                >
                  Data Science
                </Badge>
                <span className="text-muted-foreground">Remote</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSuccessStories;
