import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { auditService } from "@/services/auditService";
import { notificationService } from "@/services/notificationService";

interface GiveRecognitionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function GiveRecognitionForm({ onClose, onSuccess }: GiveRecognitionFormProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    to_user: "",
    title: "",
    message: "",
    recognition_type: "appreciation",
    is_public: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles-recognition'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .neq('id', profile?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.to_user || !formData.title || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('recognition')
        .insert([{
          from_user: profile?.id,
          to_user: formData.to_user,
          title: formData.title,
          message: formData.message,
          recognition_type: formData.recognition_type,
          is_public: formData.is_public,
        }]);

      if (error) throw error;

      // Log audit trail
      await auditService.logRecognitionGiven('new-recognition', {
        to_user: formData.to_user,
        title: formData.title,
        recognition_type: formData.recognition_type,
      });

      // Send notification to recipient
      await notificationService.createRecognitionNotification(
        formData.to_user,
        profile?.full_name || 'Someone',
        formData.title
      );

      toast({
        title: "Success",
        description: "Recognition sent successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error giving recognition:', error);
      toast({
        title: "Error",
        description: "Failed to send recognition",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Give Recognition</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="to_user">Recognize *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, to_user: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.full_name} ({person.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="recognition_type">Type</Label>
            <Select value={formData.recognition_type} onValueChange={(value) => setFormData(prev => ({ ...prev, recognition_type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appreciation">Appreciation</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="peer_nomination">Peer Nomination</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Outstanding Project Delivery"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Write your recognition message..."
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: !!checked }))}
            />
            <Label htmlFor="is_public" className="text-sm">
              Make this recognition public
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Recognition"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}