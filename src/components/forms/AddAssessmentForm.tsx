import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddAssessmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAssessmentForm({ onClose, onSuccess }: AddAssessmentFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "performance",
    employee_id: "",
    evaluator_id: "",
    scheduled_date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: employees = [] } = useQuery({
    queryKey: ['employees-for-assessment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, email, role');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles-for-evaluators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .in('role', ['hr', 'manager']);
      if (error) throw error;
      return data || [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.employee_id || !formData.evaluator_id) {
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
        .from('assessments')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment created successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Error",
        description: "Failed to create assessment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Create New Assessment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Assessment Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Q1 Performance Review"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Assessment description..."
          />
        </div>

        <div>
          <Label htmlFor="type">Assessment Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select assessment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance Review</SelectItem>
              <SelectItem value="annual">Annual Review</SelectItem>
              <SelectItem value="probation">Probation Review</SelectItem>
              <SelectItem value="project">Project Assessment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="employee_id">Employee *</Label>
          <Select value={formData.employee_id} onValueChange={(value) => setFormData(prev => ({ ...prev, employee_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="evaluator_id">Evaluator *</Label>
          <Select value={formData.evaluator_id} onValueChange={(value) => setFormData(prev => ({ ...prev, evaluator_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select evaluator" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.full_name} ({profile.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="scheduled_date">Scheduled Date</Label>
          <Input
            id="scheduled_date"
            type="date"
            value={formData.scheduled_date}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Assessment"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}