import { useState } from "react";
import { Award, Plus, Heart, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import GiveRecognitionForm from "@/components/forms/GiveRecognitionForm";
import RecognitionCard from "@/components/recognition/RecognitionCard";

export default function RecognitionPage() {
  const { profile } = useAuth();
  const [showGiveRecognition, setShowGiveRecognition] = useState(false);

  const { data: recognitions = [], refetch } = useQuery({
    queryKey: ['recognitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recognition')
        .select(`
          *,
          from_profile:profiles!recognition_from_user_fkey(full_name),
          to_profile:profiles!recognition_to_user_fkey(full_name)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data?.map(r => ({
        ...r,
        from_user_name: r.from_profile?.full_name || 'Unknown',
        to_user_name: r.to_profile?.full_name || 'Unknown',
      })) || [];
    },
  });

  const { data: myRecognitions = [] } = useQuery({
    queryKey: ['my-recognitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recognition')
        .select(`
          *,
          from_profile:profiles!recognition_from_user_fkey(full_name),
          to_profile:profiles!recognition_to_user_fkey(full_name)
        `)
        .eq('to_user', profile?.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data?.map(r => ({
        ...r,
        from_user_name: r.from_profile?.full_name || 'Unknown',
        to_user_name: r.to_profile?.full_name || 'Unknown',
      })) || [];
    },
    enabled: !!profile?.id,
  });

  const recognitionStats = {
    total: recognitions.length,
    achievements: recognitions.filter(r => r.recognition_type === 'achievement').length,
    appreciations: recognitions.filter(r => r.recognition_type === 'appreciation').length,
    milestones: recognitions.filter(r => r.recognition_type === 'milestone').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recognition & Awards</h1>
        <Dialog open={showGiveRecognition} onOpenChange={setShowGiveRecognition}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Give Recognition
            </Button>
          </DialogTrigger>
          <DialogContent>
            <GiveRecognitionForm 
              onClose={() => setShowGiveRecognition(false)}
              onSuccess={() => {
                refetch();
                setShowGiveRecognition(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Recognition</p>
              <p className="text-2xl font-semibold">{recognitionStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-2xl font-semibold">{recognitionStats.achievements}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Appreciations</p>
              <p className="text-2xl font-semibold">{recognitionStats.appreciations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Milestones</p>
              <p className="text-2xl font-semibold">{recognitionStats.milestones}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="public" className="space-y-4">
        <TabsList>
          <TabsTrigger value="public">Public Recognition</TabsTrigger>
          <TabsTrigger value="my-recognition">My Recognition</TabsTrigger>
        </TabsList>

        <TabsContent value="public" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recognitions.map((recognition) => (
              <RecognitionCard key={recognition.id} recognition={recognition} />
            ))}
          </div>
          {recognitions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No public recognition yet.</p>
              <p className="text-sm text-gray-400 mt-2">Be the first to recognize someone's great work!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-recognition" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRecognitions.map((recognition) => (
              <RecognitionCard key={recognition.id} recognition={recognition} />
            ))}
          </div>
          {myRecognitions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't received any recognition yet.</p>
              <p className="text-sm text-gray-400 mt-2">Keep up the great work!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}