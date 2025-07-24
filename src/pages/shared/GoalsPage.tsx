
import { Target, Plus, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddGoalForm from "@/components/forms/AddGoalForm";
import UpdateProgressButton from "@/components/goals/UpdateProgressButton";
import ViewDetailsButton from "@/components/goals/ViewDetailsButton";

export default function GoalsPage() {
  const { profile } = useAuth();
  const [showAddGoal, setShowAddGoal] = useState(false);
  
  const { data: goals = [], refetch } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select(`
          *,
          created_by_profile:profiles!goals_created_by_fkey(full_name),
          assigned_to_profile:profiles!goals_assigned_to_fkey(full_name)
        `);
      if (error) throw error;
      return data || [];
    },
  });

  const isHR = profile?.role === "hr";
  const isManager = profile?.role === "manager";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Goals Management</h1>
        {isHR && (
          <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <AddGoalForm 
                onClose={() => setShowAddGoal(false)} 
                onSuccess={() => {
                  refetch();
                  setShowAddGoal(false);
                }} 
              />
            </DialogContent>
          </Dialog>
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
                <span>Created by: {goal.created_by_profile?.full_name || 'N/A'}</span>
                <span>Due: {goal.end_date || 'No deadline'}</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              {profile?.role === "employee" && goal.status === "active" && (
                <UpdateProgressButton goalId={goal.id} currentProgress={goal.progress} onSuccess={refetch} />
              )}
              {isHR && (
                <Button variant="outline" size="sm">Edit Goal</Button>
              )}
              <ViewDetailsButton goal={goal} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
