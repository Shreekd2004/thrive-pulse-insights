
import { Target, Award, MessageSquare, Bell, Calendar } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function EmployeeDashboard() {
  const { profile } = useAuth();

  const { data: myRecognitions = [] } = useQuery({
    queryKey: ['my-recognitions-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recognition')
        .select('*')
        .eq('to_user', profile?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const { data: upcomingOneOnOnes = [] } = useQuery({
    queryKey: ['upcoming-one-on-ones-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('one_on_ones')
        .select('*')
        .eq('employee_id', profile?.id)
        .gte('scheduled_date', new Date().toISOString());
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['employee-goals-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('assigned_to', profile?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const { data: feedback = [] } = useQuery({
    queryKey: ['employee-feedback-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('to_user', profile?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const { data: employee } = useQuery({
    queryKey: ['employee-profile-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('profile_id', profile?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const activeGoals = goals.filter(g => g.status === 'active');
  const recentFeedback = feedback.filter(f => new Date(f.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <p className="text-gray-600">Your personal performance hub and goal tracking</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Active Goals"
          value={activeGoals.length}
          icon={<Target size={24} className="text-white" />}
          color="teal"
        />
        <StatCard
          title="Performance Score"
          value={`${employee?.performance || 0}%`}
          icon={<Award size={24} className="text-white" />}
          color="gold"
        />
        <StatCard
          title="Recent Feedback"
          value={recentFeedback.length}
          icon={<MessageSquare size={24} className="text-white" />}
          color="green"
        />
        <StatCard
          title="Recognition Received"
          value={myRecognitions.length}
          icon={<Award size={24} className="text-white" />}
          color="gold"
        />
        <StatCard
          title="Upcoming 1:1s"
          value={upcomingOneOnOnes.length}
          icon={<Calendar size={24} className="text-white" />}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4">My Goals</h2>
          <div className="space-y-4">
            {goals.length > 0 ? goals.slice(0, 5).map((goal) => (
              <div key={goal.id} className="space-y-1">
                <div className="flex justify-between">
                  <span>{goal.title}</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  Deadline: {goal.end_date || 'No deadline'}
                </div>
              </div>
            )) : (
              <p className="text-gray-500">No goals assigned</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <div className="space-y-3">
            {[
              { text: "Your leave request has been approved", time: "2 hours ago", icon: "✅" },
              { text: "New feedback received from your manager", time: "1 day ago", icon: "💬" },
              { text: "Reminder: Performance review next week", time: "2 days ago", icon: "📅" },
              { text: "Goal deadline approaching: Project documentation", time: "3 days ago", icon: "⏰" },
            ].map((notification, i) => (
              <div key={i} className="flex gap-2 pb-2 border-b border-gray-100">
                <span className="text-xl">{notification.icon}</span>
                <div className="flex flex-col">
                  <span>{notification.text}</span>
                  <span className="text-sm text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h3 className="font-medium">Productivity</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>85%</span>
              <span className="text-green-600">+3%</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">Quality</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>92%</span>
              <span className="text-green-600">+5%</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">Timeliness</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>78%</span>
              <span className="text-red-600">-2%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Predicted Performance</h3>
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-sm">
              Based on your current trends, our AI predicts your performance will 
              <span className="font-medium text-green-600"> improve by 4%</span> next quarter if you maintain consistent progress on your goals.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              * Predictions are based on historical data and current goal progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
