
import { FileText, Star, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function AssessmentsPage() {
  const { user } = useAuth();
  
  const assessments = [
    { 
      id: 1, 
      title: "Q2 Performance Review", 
      type: "Quarterly Review", 
      evaluator: "Sarah Wilson", 
      date: "2025-06-01", 
      status: "completed", 
      score: 87,
      feedback: "Excellent technical skills and team collaboration. Continue focusing on leadership development."
    },
    { 
      id: 2, 
      title: "Project Alpha Evaluation", 
      type: "Project Assessment", 
      evaluator: "Michael Brown", 
      date: "2025-05-15", 
      status: "completed", 
      score: 92,
      feedback: "Outstanding project delivery. Great attention to detail and problem-solving approach."
    },
    { 
      id: 3, 
      title: "Annual Performance Assessment", 
      type: "Annual Review", 
      evaluator: "HR Team", 
      date: "2025-07-01", 
      status: "scheduled", 
      score: null,
      feedback: null
    },
  ];

  const teamAssessments = [
    { id: 1, employee: "John Smith", title: "Q2 Performance Review", dueDate: "2025-06-30", status: "pending" },
    { id: 2, employee: "Emma Davis", title: "Leadership Assessment", dueDate: "2025-06-25", status: "completed" },
    { id: 3, employee: "David Miller", title: "Design Portfolio Review", dueDate: "2025-07-05", status: "pending" },
  ];

  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isManager ? "Team Assessments" : "My Assessments"}
        </h1>
        {isManager && (
          <Button className="bg-teal-600 hover:bg-teal-700">
            <FileText className="h-4 w-4 mr-2" />
            Create Assessment
          </Button>
        )}
      </div>

      {isEmployee && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-semibold">
                    {assessments.filter(a => a.score).reduce((sum, a) => sum + a.score!, 0) / assessments.filter(a => a.score).length}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-semibold">{assessments.filter(a => a.status === "completed").length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-semibold">{assessments.filter(a => a.status === "scheduled").length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Assessment History</h2>
            {assessments.map((assessment) => (
              <div key={assessment.id} className="bg-white p-6 rounded-lg shadow border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                    <p className="text-sm text-gray-600">{assessment.type}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(assessment.status)}`}>
                    {assessment.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Evaluator: {assessment.evaluator}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Date: {assessment.date}</span>
                  </div>
                  {assessment.score && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium">Score: {assessment.score}%</span>
                    </div>
                  )}
                </div>
                
                {assessment.feedback && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{assessment.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {isManager && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Team Assessment Queue</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamAssessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {assessment.employee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assessment.status)}`}>
                          {assessment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {assessment.status === "pending" ? (
                          <Button variant="outline" size="sm">Conduct Assessment</Button>
                        ) : (
                          <Button variant="outline" size="sm">View Results</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
