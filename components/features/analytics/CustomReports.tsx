import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Calendar, BarChart3 } from 'lucide-react';

const CustomReports = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🧾 Custom Reports & Export Options</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Job Analytics Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Candidate Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select metrics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applications">Applications</SelectItem>
                <SelectItem value="profile_views">Profile Views</SelectItem>
                <SelectItem value="registrations">Registrations</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Automated monthly reports for administrators
            </p>
            <Button className="w-full">
              Generate Monthly Report
            </Button>
            <Button variant="outline" className="w-full">
              Schedule Auto-Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Executive Summary</h3>
              <p className="text-sm text-muted-foreground mb-4">
                High-level overview of platform performance and key metrics
              </p>
              <Button size="sm">Generate Report</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Detailed Analytics</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive analysis with charts and detailed breakdowns
              </p>
              <Button size="sm">Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReports;
