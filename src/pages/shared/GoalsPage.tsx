
import { Target, Plus, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function GoalsPage() {
  const { user } = useAuth();
  
  const goals = [
    { id: 1, title: "Increase Customer Satisfaction", description: "Improve customer satisfaction score to 90%", deadline: "2025-12-31", progress: 75, assignedBy: "HR", status: "active" },
    { id: 2, title: "Complete Product Launch", description: "Launch new product feature successfully", deadline: "2025-08-15", progress: 45, assignedBy: "Sarah Wilson", status: "active" },
    { id: 3, title: "Team Training Program", description: "Complete leadership training for all managers", deadline: "2025-09-30", progress: 30, assignedBy: "HR", status: "active" },
    { id: 4, title: "Cost Reduction Initiative", description: "Reduce operational costs by 15%", deadline: "2025-11-30", progress: 90, assignedBy: "HR", status: "completed" },
  ];

  const isHR = user?.role === "hr";
  const isManager = user?.role === "manager";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Goals Management</h1>
        {(isHR || isManager) && (
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            {isHR ? "Create Organization Goal" : "Assign Goal"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-teal-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Active Goals</p>
              <p className="text-2xl font-semibold">{goals.filter(g => g.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold">{goals.filter(g => g.progress < 100 && g.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-semibold">{goals.filter(g => g.status === "completed").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                goal.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}>
                {goal.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Assigned by: {goal.assignedBy}</span>
                <span>Due: {goal.deadline}</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              {user?.role === "employee" && goal.status === "active" && (
                <Button variant="outline" size="sm">Update Progress</Button>
              )}
              {(isHR || isManager) && (
                <Button variant="outline" size="sm">Edit Goal</Button>
              )}
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
