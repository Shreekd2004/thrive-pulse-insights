
import { Target, Users, Award, Bell } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export default function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manager Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Team Members"
          value={8}
          icon={<Users size={24} className="text-white" />}
          color="teal"
        />
        <StatCard
          title="Active Goals"
          value={12}
          icon={<Target size={24} className="text-white" />}
          color="gold"
        />
        <StatCard
          title="Team Performance"
          value="87%"
          icon={<Award size={24} className="text-white" />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Team Goals Progress</h2>
          <div className="space-y-4">
            {[
              { name: "Q2 Sales Target", progress: 75 },
              { name: "Customer Satisfaction", progress: 88 },
              { name: "Product Development", progress: 45 },
              { name: "Team Training", progress: 60 },
            ].map((goal, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <span>{goal.name}</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
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
              {[
                { name: "John Smith", position: "Senior Developer", performance: "High", goals: "4/5", risk: "Low" },
                { name: "Sarah Wilson", position: "UI Designer", performance: "Medium", goals: "3/4", risk: "Medium" },
                { name: "Michael Brown", position: "Backend Developer", performance: "High", goals: "5/5", risk: "Low" },
                { name: "Emma Davis", position: "Product Manager", performance: "Medium", goals: "2/3", risk: "Low" },
              ].map((employee, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      employee.performance === "High" ? "bg-green-100 text-green-800" : 
                      employee.performance === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                      "bg-red-100 text-red-800"
                    }`}>
                      {employee.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.goals}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      employee.risk === "Low" ? "bg-green-100 text-green-800" : 
                      employee.risk === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                      "bg-red-100 text-red-800"
                    }`}>
                      {employee.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
