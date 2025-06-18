
import { Award, Target, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function MyPerformancePage() {
  const { user } = useAuth();
  
  const performanceData = {
    currentScore: 87,
    lastMonthScore: 84,
    goalsCompleted: 4,
    totalGoals: 5,
    feedbackReceived: 3,
    upcomingReviews: 1
  };

  const monthlyTrends = [
    { month: "Jan", score: 78 },
    { month: "Feb", score: 82 },
    { month: "Mar", score: 79 },
    { month: "Apr", score: 85 },
    { month: "May", score: 84 },
    { month: "Jun", score: 87 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Performance</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Current Score</p>
              <p className="text-2xl font-semibold">{performanceData.currentScore}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Goals Progress</p>
              <p className="text-2xl font-semibold">{performanceData.goalsCompleted}/{performanceData.totalGoals}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Monthly Change</p>
              <p className="text-2xl font-semibold text-green-600">
                +{performanceData.currentScore - performanceData.lastMonthScore}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Upcoming Reviews</p>
              <p className="text-2xl font-semibold">{performanceData.upcomingReviews}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <div className="space-y-4">
            {monthlyTrends.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium">{month.month}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-teal-600 h-2 rounded-full" 
                      style={{ width: `${month.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{month.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">AI Performance Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-900 mb-2">🎯 Predicted Performance</h4>
              <p className="text-sm text-blue-800">
                Based on your current trends, our AI predicts your performance will 
                <span className="font-medium"> improve by 4%</span> next quarter.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium text-green-900 mb-2">💪 Strengths</h4>
              <p className="text-sm text-green-800">
                You excel in problem-solving and consistently meet deadlines. 
                Your collaboration skills have improved significantly.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <h4 className="font-medium text-yellow-900 mb-2">🎯 Areas for Growth</h4>
              <p className="text-sm text-yellow-800">
                Consider focusing on technical documentation and knowledge sharing 
                to enhance your impact on team productivity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Performance Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Productivity</span>
              <span className="text-sm text-gray-600">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-green-600">+3% from last month</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Quality</span>
              <span className="text-sm text-gray-600">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <p className="text-xs text-green-600">+5% from last month</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Collaboration</span>
              <span className="text-sm text-gray-600">88%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: '88%' }}></div>
            </div>
            <p className="text-xs text-green-600">+2% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
