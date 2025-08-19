import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Search, Eye, Bookmark, TrendingUp } from 'lucide-react';

const ProfileInsights = () => {
  // Mock data - would come from database
  const searchData = [
    { keyword: 'React Developer', searches: 1456, results: 234 },
    { keyword: 'Data Scientist', searches: 1234, results: 189 },
    { keyword: 'Marketing Manager', searches: 987, results: 156 },
    { keyword: 'Sales Executive', searches: 876, results: 203 },
    { keyword: 'UI/UX Designer', searches: 765, results: 134 }
  ];

  const locationSearches = [
    { location: 'Dubai', searches: 2345 },
    { location: 'Cairo', searches: 1987 },
    { location: 'Riyadh', searches: 1654 },
    { location: 'Kuwait', searches: 1234 },
    { location: 'Amman', searches: 987 }
  ];

  const profileActivity = [
    { date: '2025-01-03', views: 2340, bookmarks: 234, searches: 1456 },
    { date: '2025-01-04', views: 2567, bookmarks: 267, searches: 1587 },
    { date: '2025-01-05', views: 2789, bookmarks: 289, searches: 1689 }
  ];

  const latestActivity = profileActivity[profileActivity.length - 1];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">👀 Profile & Search Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestActivity.views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Profiles viewed by employers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Bookmarks</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestActivity.bookmarks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Profiles saved by employers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestActivity.searches.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Job seeker searches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmark Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((latestActivity.bookmarks / latestActivity.views) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">View to bookmark conversion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Searched Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={searchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="searches" fill="#8884d8" name="Searches" />
                <Bar dataKey="results" fill="#82ca9d" name="Results" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Searched Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationSearches}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="searches" fill="#ffc658" name="Location Searches" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Activity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profileActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#8884d8" name="Profile Views" />
              <Line type="monotone" dataKey="bookmarks" stroke="#82ca9d" name="Bookmarks" />
              <Line type="monotone" dataKey="searches" stroke="#ffc658" name="Searches" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Analytics Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchData.slice(0, 3).map((item, index) => (
                <div key={item.keyword} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{item.keyword}</p>
                    <p className="text-sm text-muted-foreground">{item.searches} searches</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{item.results}</p>
                    <p className="text-sm text-muted-foreground">results</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employer Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{latestActivity.views}</div>
                <div className="text-sm text-muted-foreground">Daily Profile Views</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{latestActivity.bookmarks}</div>
                <div className="text-sm text-muted-foreground">Profiles Bookmarked</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {((latestActivity.bookmarks / latestActivity.views) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Engagement Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileInsights;
