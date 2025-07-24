
import { Target, Users, Award, Bell } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function ManagerDashboard() {
  const { profile } = useAuth();

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('manager_id', profile?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['manager-goals-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('status', 'active');
      if (error) throw error;
      return data || [];
    },
  });

  const averagePerformance = teamMembers.length > 0 
    ? Math.round(teamMembers.reduce((sum, member) => sum + (member.performance || 0), 0) / teamMembers.length)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manager Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Team Members"
          value={teamMembers.length}
          icon={<Users size={24} className="text-white" />}
          color="teal"
        />
        <StatCard
          title="Active Goals"
          value={goals.length}
          icon={<Target size={24} className="text-white" />}
          color="gold"
        />
        <StatCard
          title="Team Performance"
          value={`${averagePerformance}%`}
          icon={<Award size={24} className="text-white" />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Team Goals Progress</h2>
          <div className="space-y-4">
            {goals.length > 0 ? goals.slice(0, 4).map((goal) => (
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
              </div>
            )) : (
              <p className="text-gray-500">No active goals found</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <div className="space-y-3">
            {[
              { text: "New leave request from David Miller", time: "1 hour ago", icon: "🔔" },
              { text: "Performance assessment due for Sarah", time: "1 day ago", icon: "⏰" },
              { text: "Team meeting scheduled for tomorrow", time: "2 days ago", icon: "📅" },
              { text: "Goal deadline approaching: Q2 Sales Target", time: "2 days ago", icon: "🎯" },
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
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attrition Risk</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.length > 0 ? teamMembers.map((employee) => {
                const performanceLevel = employee.performance >= 80 ? "High" : employee.performance >= 60 ? "Medium" : "Low";
                const risk = employee.performance >= 75 ? "Low" : employee.performance >= 50 ? "Medium" : "High";
                
                return (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        performanceLevel === "High" ? "bg-green-100 text-green-800" : 
                        performanceLevel === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        {performanceLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.performance}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        risk === "Low" ? "bg-green-100 text-green-800" : 
                        risk === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        {risk}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No team members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
