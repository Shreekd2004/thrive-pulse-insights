
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface AddLeaveFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddLeaveForm({ onClose, onSuccess }: AddLeaveFormProps) {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    employee_id: "",
    type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set employee_id automatically for employees
  useEffect(() => {
    if (profile && profile.role === 'employee') {
      // Get the employee record for the current user
      const fetchCurrentEmployee = async () => {
        const { data, error } = await supabase
          .from('employees')
          .select('id')
          .eq('profile_id', profile.id)
          .single();
        
        if (data && !error) {
          setFormData(prev => ({ ...prev, employee_id: data.id }));
        }
      };
      
      fetchCurrentEmployee();
    }
  }, [profile]);

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name');
      if (error) throw error;
      return data || [];
    },
    // Only fetch employees if user is HR (can select any employee)
    enabled: profile?.role === 'hr'
  });

  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employee_id) {
      alert('Employee information is missing');
      return;
    }
    
    if (!formData.type) {
      alert('Please select a leave type');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const days = calculateDays(formData.start_date, formData.end_date);
      
      const { error } = await supabase
        .from('leave_requests')
        .insert([{
          employee_id: formData.employee_id,
          type: formData.type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          days: days,
          reason: formData.reason,
        }]);

      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding leave request:', error);
      alert('Failed to submit leave request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Leave Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Only show employee dropdown for HR users */}
          {profile?.role === 'hr' && (
            <div>
              <Label htmlFor="employee">Employee</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, employee_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-employees" disabled>
                      No employees available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Show employee name for non-HR users */}
          {profile?.role !== 'hr' && (
            <div>
              <Label>Employee</Label>
              <Input 
                value={profile?.full_name || ''} 
                disabled 
                className="bg-muted"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="type">Leave Type</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="maternity">Maternity</SelectItem>
                <SelectItem value="paternity">Paternity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              required
            />
          </div>
          
          {formData.start_date && formData.end_date && (
            <div className="text-sm text-gray-600">
              Duration: {calculateDays(formData.start_date, formData.end_date)} days
            </div>
          )}
          
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for leave"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Request"}
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
