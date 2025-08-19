import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, FileText, MessageSquare, Calendar, Users } from "lucide-react";
const WhyJobSeekers = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Job Seekers Choose WazifaME
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join 250,000+ active professionals and discover your next career
            opportunity
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Smart Job Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center text-sm">
                Get personalized job notifications matching your skills and
                preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-lg">AI Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center text-sm">
                Smart algorithms match you with roles based on your skills and
                experience.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg">AI-Generated CV</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center text-sm">
                Create professional CVs with multiple templates and AI
                assistance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Direct Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center text-sm">
                Communicate directly with employers and hiring managers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Easy Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center text-sm">
                Schedule interviews right from your dashboard with calendar
                integration.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyJobSeekers;
