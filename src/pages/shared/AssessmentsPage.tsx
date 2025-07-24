import { Target, CheckCircle, FileText, Clock, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddAssessmentForm from "@/components/forms/AddAssessmentForm";
import { useState } from "react";

export default function AssessmentsPage() {
  const { profile } = useAuth();
  const isManager = profile?.role === "manager";
  const isHR = profile?.role === "hr";
  const [showAddAssessment, setShowAddAssessment] = useState(false);

  const { data: assessments = [], refetch } = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assessments')
        .select('*');
      if (error) throw error;
      return data || [];
    },
  });

  const myAssessments = isHR ? assessments : assessments.filter(a => a.employee_id === profile?.id || a.evaluator_id === profile?.id);
  const teamAssessments = isManager ? assessments.filter(a => a.evaluator_id === profile?.id) : [];

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
        <h1 className="text-2xl font-bold">Assessments</h1>
        {isHR && (
          <Dialog open={showAddAssessment} onOpenChange={setShowAddAssessment}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <AddAssessmentForm 
                onClose={() => setShowAddAssessment(false)} 
                onSuccess={() => {
                  refetch();
                  setShowAddAssessment(false);
                }} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-semibold">
                {myAssessments.filter(a => a.score).length > 0 
                  ? Math.round(myAssessments.filter(a => a.score).reduce((sum, a) => sum + a.score!, 0) / myAssessments.filter(a => a.score).length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-semibold">{myAssessments.filter(a => a.status === "completed").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold">{myAssessments.filter(a => a.status === "pending").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Assessment History</h2>
        {myAssessments.length > 0 ? myAssessments.map((assessment) => (
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
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-sm text-gray-600">Evaluator: N/A</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">
                  Date: {assessment.scheduled_date || assessment.completed_date || 'N/A'}
                </span>
              </div>
              {assessment.score && (
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Score: {assessment.score}%</span>
                  </div>
                </div>
              )}
            </div>
            
            {assessment.feedback && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-700">{assessment.feedback}</p>
              </div>
            )}
          </div>
        )) : (
          <p className="text-gray-500">No assessments found</p>
        )}
      </div>

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
                  {teamAssessments.length > 0 ? teamAssessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        N/A
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.scheduled_date || 'Not scheduled'}
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
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No team assessments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}