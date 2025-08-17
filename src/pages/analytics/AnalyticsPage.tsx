import { BarChart, TrendingUp, Users, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PerformanceChart from "@/components/performance/PerformanceChart";
import NineBoxGrid from "@/components/performance/NineBoxGrid";

export default function AnalyticsPage() {
  const { profile } = useAuth();
  const isHR = profile?.role === 'hr';

  const { data: employees = [] } = useQuery({
    queryKey: ['employees-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['goals-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: feedback = [] } = useQuery({
    queryKey: ['feedback-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*');
      if (error) throw error;
      return data || [];
    },
  });

  // Mock performance trend data
  const performanceTrendData = [
    { month: 'Jan', performance: 78, goals: 85, feedback: 4.2 },
    { month: 'Feb', performance: 82, goals: 88, feedback: 4.3 },
    { month: 'Mar', performance: 79, goals: 82, feedback: 4.1 },
    { month: 'Apr', performance: 85, goals: 90, feedback: 4.4 },
    { month: 'May', performance: 87, goals: 92, feedback: 4.5 },
    { month: 'Jun', performance: 89, goals: 95, feedback: 4.6 },
  ];

  // Prepare data for 9-box grid
  const nineBoxEmployees = employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    performance: emp.performance || 70,
    potential: Math.floor(Math.random() * 40) + 60, // Mock potential score
  }));

  const analytics = {
    totalEmployees: employees.length,
    avgPerformance: employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + (emp.performance || 0), 0) / employees.length) : 0,
    goalCompletionRate: goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0,
    avgFeedbackRating: feedback.length > 0 ? (feedback.reduce((sum, f) => sum + (f.rating || 3), 0) / feedback.length).toFixed(1) : '0',
  };

  if (!isHR) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Analytics are only available to HR administrators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-semibold">{analytics.totalEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Avg Performance</p>
              <p className="text-2xl font-semibold">{analytics.avgPerformance}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Goal Completion</p>
              <p className="text-2xl font-semibold">{analytics.goalCompletionRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Avg Feedback</p>
              <p className="text-2xl font-semibold">{analytics.avgFeedbackRating}/5</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="nine-box">9-Box Grid</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart data={performanceTrendData} type="line" />
            <PerformanceChart data={performanceTrendData} type="bar" />
          </div>
        </TabsContent>

        <TabsContent value="nine-box" className="space-y-4">
          <NineBoxGrid employees={nineBoxEmployees} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-900 mb-2">🎯 Top Performers</h4>
                  <p className="text-sm text-blue-800">
                    {employees.filter(e => (e.performance || 0) >= 85).length} employees are performing above 85%. 
                    Consider them for leadership development programs.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <h4 className="font-medium text-yellow-900 mb-2">⚠️ At-Risk Employees</h4>
                  <p className="text-sm text-yellow-800">
                    {employees.filter(e => (e.performance || 0) < 70).length} employees may need additional support. 
                    Schedule 1:1s to understand their challenges.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="font-medium text-green-900 mb-2">📈 Trending Up</h4>
                  <p className="text-sm text-green-800">
                    Overall team performance has improved by 8% this quarter. 
                    Goal completion rates are at an all-time high.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Focus on Development</h4>
                    <p className="text-sm text-gray-600">
                      3 employees would benefit from skill development programs in their current roles.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Recognition Opportunity</h4>
                    <p className="text-sm text-gray-600">
                      Emma Davis and Robert Chen have consistently exceeded expectations this quarter.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Review Scheduling</h4>
                    <p className="text-sm text-gray-600">
                      5 employees are due for their quarterly performance reviews within the next 2 weeks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}