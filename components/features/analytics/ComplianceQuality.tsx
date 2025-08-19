import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';

const ComplianceQuality = () => {
  // Mock compliance data
  const complianceData = {
    missing_salary: 156,
    missing_location: 89,
    validation_issues: 23,
    login_failures: 45,
    password_resets: 67
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">✅ Compliance & Quality</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Salary Info</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceData.missing_salary}</div>
            <p className="text-xs text-muted-foreground">Jobs without salary</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Location</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceData.missing_location}</div>
            <p className="text-xs text-muted-foreground">Jobs without location</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Failures</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceData.login_failures}</div>
            <p className="text-xs text-muted-foreground">Failed login attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Password Resets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceData.password_resets}</div>
            <p className="text-xs text-muted-foreground">Password reset requests</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quality Compliance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-800">Critical Issues</p>
                <p className="text-sm text-red-600">Jobs missing essential information</p>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {complianceData.missing_salary + complianceData.missing_location}
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800">Security Events</p>
                <p className="text-sm text-yellow-600">Authentication-related issues</p>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {complianceData.login_failures + complianceData.password_resets}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceQuality;
