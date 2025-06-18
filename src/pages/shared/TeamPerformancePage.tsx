
import { BarChart, TrendingUp, Users, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function TeamPerformancePage() {
  const { user } = useAuth();
  
  const teamData = [
    { id: 1, name: "John Smith", position: "Senior Developer", performance: 85, goalsCompleted: 4, totalGoals: 5, attritionRisk: "low" },
    { id: 2, name: "Emma Davis", position: "Product Manager", performance: 92, goalsCompleted: 3, totalGoals: 4, attritionRisk: "low" },
    { id: 3, name: "David Miller", position: "Designer", performance: 78, goalsCompleted: 2, totalGoals: 4, attritionRisk: "medium" },
    { id: 4, name: "Lisa Johnson", position: "Marketing Specialist", performance: 88, goalsCompleted: 3, totalGoals: 3, attritionRisk: "low" },
  ];

  const avgPerformance = teamData.reduce((sum, emp) => sum + emp.performance, 0) / teamData.length;
  const totalGoalsCompleted = teamData.reduce((sum, emp) => sum + emp.goalsCompleted, 0);
  const totalGoals = teamData.reduce((sum, emp) => sum + emp.totalGoals, 0);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isHR = user?.role === "hr";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isHR ? "Organization Performance" : "Team Performance"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-semibold">{teamData.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Avg Performance</p>
              <p className="text-2xl font-semibold">{avgPerformance.toFixed(0)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Goals Completion</p>
              <p className="text-2xl font-semibold">{Math.round((totalGoalsCompleted / totalGoals) * 100)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <BarChart className="h-8 w-8 text-teal-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">High Performers</p>
              <p className="text-2xl font-semibold">{teamData.filter(emp => emp.performance >= 85).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <div className="space-y-4">
            {teamData.map((emp) => (
              <div key={emp.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{emp.name}</span>
                  <span className="text-sm text-gray-600">{emp.performance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-600 h-2 rounded-full" 
                    style={{ width: `${emp.performance}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Goals Progress</h3>
          <div className="space-y-4">
            {teamData.map((emp) => (
              <div key={emp.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{emp.name}</p>
                  <p className="text-xs text-gray-600">{emp.position}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{emp.goalsCompleted}/{emp.totalGoals}</p>
                  <p className="text-xs text-gray-600">
                    {Math.round((emp.goalsCompleted / emp.totalGoals) * 100)}% complete
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Attrition Risk Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attrition Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                        <div className="text-sm text-gray-500">{emp.position}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.performance}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.goalsCompleted}/{emp.totalGoals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(emp.attritionRisk)}`}>
                        {emp.attritionRisk} risk
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-green-600">+3% predicted</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
