import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, Calendar, Plus, Clock } from 'lucide-react';

const TasksSchedule = () => {
  const tasks = [
    {
      title: 'Resume Screening',
      category: 'Evaluation',
      progress: 40,
      dueDate: 'May 27, 2027',
      status: 'in-progress'
    },
    {
      title: 'Interview Scheduling',
      category: 'Engagement',
      progress: 60,
      dueDate: 'May 20, 2027',
      status: 'in-progress'
    },
    {
      title: 'Candidate Communication',
      category: 'Relationship',
      progress: 30,
      dueDate: 'May 23, 2027',
      status: 'pending'
    },
    {
      title: 'Offer Management',
      category: 'Selection',
      progress: 50,
      dueDate: 'May 25, 2027',
      status: 'in-progress'
    }
  ];

  const schedule = [
    {
      time: '1:00 PM',
      title: 'Marketing Strategy Presentation',
      department: 'Marketing',
      type: 'meeting'
    },
    {
      time: '2:30 PM',
      title: 'HR Policy Update Session',
      department: 'Human Resources',
      type: 'session'
    },
    {
      time: '4:00 PM',
      title: 'Customer Feedback Analysis',
      department: 'Customer Support',
      type: 'analysis'
    },
    {
      time: '5:30 PM',
      title: 'Financial Reporting Session',
      department: 'Finance',
      type: 'session'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-500" />
              Tasks
            </CardTitle>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{task.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {task.category}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{task.progress}%</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.dueDate}
                    </span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Schedule
            </CardTitle>
            <Badge variant="outline">Today</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedule.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="text-sm font-medium text-green-600 min-w-0">
                  {item.time}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.department}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksSchedule;
