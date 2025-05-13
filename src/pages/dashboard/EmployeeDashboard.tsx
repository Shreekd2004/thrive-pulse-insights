
import { Target, Award, MessageSquare, Bell } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useAuth } from "@/contexts/AuthContext";

export default function EmployeeDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Employee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Active Goals"
          value={5}
          icon={<Target size={24} className="text-white" />}
          color="teal"
        />
        <StatCard
          title="Performance Score"
          value="82%"
          icon={<Award size={24} className="text-white" />}
          color="gold"
        />
        <StatCard
          title="Recent Feedback"
          value={3}
          icon={<MessageSquare size={24} className="text-white" />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4">My Goals</h2>
          <div className="space-y-4">
            {[
              { name: "Complete project documentation", progress: 70, deadline: "May 30, 2025" },
              { name: "Learn new framework", progress: 45, deadline: "June 15, 2025" },
              { name: "Improve code quality", progress: 90, deadline: "May 20, 2025" },
              { name: "Client presentation preparation", progress: 30, deadline: "June 5, 2025" },
              { name: "Team collaboration improvement", progress: 65, deadline: "Ongoing" },
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
                <div className="text-xs text-gray-500">Deadline: {goal.deadline}</div>
              </div>
            ))}
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
