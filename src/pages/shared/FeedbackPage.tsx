
import { MessageSquare, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddFeedbackForm from "@/components/forms/AddFeedbackForm";

export default function FeedbackPage() {
  const { profile } = useAuth();
  const [showAddFeedback, setShowAddFeedback] = useState(false);
  
  const { data: feedbacks = [], refetch } = useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          from_profile:profiles!feedback_from_user_fkey(full_name),
          to_profile:profiles!feedback_to_user_fkey(full_name)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const getRatingColor = (rating: number | null) => {
    if (!rating) return "bg-gray-100 text-gray-800";
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating >= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRatingIcon = (rating: number | null) => {
    if (!rating) return "😐";
    if (rating >= 4) return "😊";
    if (rating >= 3) return "😐";
    return "😟";
  };

  const isManager = profile?.role === "manager";
  const isHR = profile?.role === "hr";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Feedback</h1>
        {(isHR || isManager) && (
          <Dialog open={showAddFeedback} onOpenChange={setShowAddFeedback}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Give Feedback
              </Button>
            </DialogTrigger>
            <DialogContent>
              <AddFeedbackForm 
                onClose={() => setShowAddFeedback(false)} 
                onSuccess={() => {
                  refetch();
                  setShowAddFeedback(false);
                }} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-2xl font-semibold">{feedbacks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-semibold">
                {feedbacks.length > 0 
                  ? (feedbacks.reduce((acc, f) => acc + (f.rating || 3), 0) / feedbacks.length).toFixed(1)
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">High Rated</p>
              <p className="text-2xl font-semibold">{feedbacks.filter(f => (f.rating || 0) >= 4).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {feedbacks.length > 0 ? feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {isHR ? `${feedback.from_profile?.full_name} → ${feedback.to_profile?.full_name}` : 
                     profile?.role === "employee" ? `From: ${feedback.from_profile?.full_name}` : 
                     `To: ${feedback.to_profile?.full_name}`}
                  </p>
                  <p className="text-sm text-gray-500">{new Date(feedback.created_at).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400">Category: {feedback.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getRatingIcon(feedback.rating)}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getRatingColor(feedback.rating)}`}>
                  {feedback.rating ? `${feedback.rating}/5` : 'No rating'}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{feedback.feedback_text}</p>
          </div>
        )) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No feedback available. Give feedback to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
