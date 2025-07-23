import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface AddFeedbackFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddFeedbackForm({ onClose, onSuccess }: AddFeedbackFormProps) {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    to_user: "",
    feedback_text: "",
    rating: "",
    category: "general",
    is_anonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .neq('id', profile?.id); // Don't include self
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.to_user || !formData.feedback_text) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          from_user: profile?.id,
          to_user: formData.to_user,
          feedback_text: formData.feedback_text,
          rating: formData.rating ? parseInt(formData.rating) : null,
          category: formData.category,
          is_anonymous: formData.is_anonymous,
        }]);

      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error giving feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Give Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="to_user">Give Feedback To *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, to_user: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                {profiles.length > 0 ? (
                  profiles.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.full_name} ({person.role})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-profiles" disabled>
                    No people available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="teamwork">Teamwork</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, rating: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 - Excellent</SelectItem>
                <SelectItem value="4">4 - Good</SelectItem>
                <SelectItem value="3">3 - Average</SelectItem>
                <SelectItem value="2">2 - Below Average</SelectItem>
                <SelectItem value="1">1 - Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="feedback_text">Feedback *</Label>
            <Textarea
              id="feedback_text"
              value={formData.feedback_text}
              onChange={(e) => setFormData(prev => ({ ...prev, feedback_text: e.target.value }))}
              placeholder="Enter your feedback"
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}