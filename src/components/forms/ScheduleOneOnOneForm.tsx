import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ScheduleOneOnOneFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScheduleOneOnOneForm({ onClose, onSuccess }: ScheduleOneOnOneFormProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    employee_id: "",
    scheduled_date: "",
    duration_minutes: "30",
    agenda: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members-for-1on1'],
    queryFn: async () => {
      if (profile?.role !== 'manager') return [];
      
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, profile_id')
        .eq('manager_id', profile?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: profile?.role === 'manager',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employee_id || !formData.scheduled_date) {
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
        .from('one_on_ones')
        .insert([{
          employee_id: formData.employee_id,
          manager_id: profile?.id,
          scheduled_date: formData.scheduled_date,
          duration_minutes: parseInt(formData.duration_minutes),
          agenda: formData.agenda,
          status: 'scheduled'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "1:1 meeting scheduled successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error scheduling 1:1:', error);
      toast({
        title: "Error",
        description: "Failed to schedule 1:1 meeting",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Schedule 1:1 Meeting</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="employee_id">Team Member *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, employee_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.profile_id} value={member.profile_id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="scheduled_date">Date & Time *</Label>
            <Input
              id="scheduled_date"
              type="datetime-local"
              value={formData.scheduled_date}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
            <Select value={formData.duration_minutes} onValueChange={(value) => setFormData(prev => ({ ...prev, duration_minutes: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="agenda">Agenda</Label>
            <Textarea
              id="agenda"
              value={formData.agenda}
              onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
              placeholder="Meeting agenda and topics to discuss..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
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