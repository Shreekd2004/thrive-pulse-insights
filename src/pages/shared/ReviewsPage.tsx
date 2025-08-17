import { useState } from "react";
import { FileText, Plus, Calendar, Users, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CreateReviewCycleForm from "@/components/forms/CreateReviewCycleForm";
import ReviewCycleCard from "@/components/performance/ReviewCycleCard";

export default function ReviewsPage() {
  const { profile } = useAuth();
  const [showCreateCycle, setShowCreateCycle] = useState(false);
  const isHR = profile?.role === 'hr';

  const { data: reviewCycles = [], refetch } = useQuery({
    queryKey: ['review-cycles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('review_cycles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: myReviews = [] } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_reviews')
        .select('*')
        .or(`employee_id.eq.${profile?.id},reviewer_id.eq.${profile?.id}`);
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const pendingReviews = myReviews.filter(r => r.status === 'pending');
  const completedReviews = myReviews.filter(r => r.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Performance Reviews</h1>
        {isHR && (
          <Dialog open={showCreateCycle} onOpenChange={setShowCreateCycle}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Review Cycle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CreateReviewCycleForm 
                onClose={() => setShowCreateCycle(false)}
                onSuccess={() => {
                  refetch();
                  setShowCreateCycle(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Active Cycles</p>
              <p className="text-2xl font-semibold">{reviewCycles.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-semibold">{pendingReviews.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-semibold">{completedReviews.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-2xl font-semibold">{myReviews.length}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="cycles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cycles">Review Cycles</TabsTrigger>
          <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
          {isHR && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
        </TabsList>

        <TabsContent value="cycles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewCycles.map((cycle) => (
              <ReviewCycleCard
                key={cycle.id}
                cycle={cycle}
                onManage={isHR ? (cycleId) => console.log('Manage cycle:', cycleId) : undefined}
              />
            ))}
          </div>
          {reviewCycles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No review cycles found.</p>
              {isHR && (
                <p className="text-sm text-gray-400 mt-2">Create your first review cycle to get started.</p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-reviews" className="space-y-4">
          <div className="space-y-4">
            {myReviews.length > 0 ? myReviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.review_type.charAt(0).toUpperCase() + review.review_type.slice(1)} Review
                    </h3>
                    <p className="text-sm text-gray-600">Due: {review.due_date || 'No deadline'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    review.status === 'completed' ? 'bg-green-100 text-green-800' :
                    review.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    review.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {review.status}
                  </span>
                </div>
                
                {review.overall_rating && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Overall Rating: </span>
                    <span className="font-medium">{review.overall_rating}/5</span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {review.status === 'pending' && (
                    <Button size="sm">Start Review</Button>
                  )}
                  {review.status === 'completed' && (
                    <Button variant="outline" size="sm">View Results</Button>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews assigned yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {isHR && (
          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">Review Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">85%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">4.2</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-sm text-gray-600">Days Avg Completion</p>
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}