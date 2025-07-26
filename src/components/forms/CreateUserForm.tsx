import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/contexts/AuthContext";

interface CreateUserFormProps {
  onSuccess: () => void;
}

export default function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "employee" as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create the auth user using regular signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
            role: formData.role
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // The profile will be created automatically via the database trigger
      if (authData?.user) {
        // Wait a moment for the profile to be created by the trigger
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get the created profile to get the profile ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', authData.user.id)
          .single();

        // Create corresponding employee record
        if (profile) {
          const { error: employeeError } = await supabase
            .from('employees')
            .insert([{
              name: formData.fullName,
              email: formData.email,
              role: formData.role,
              profile_id: profile.id,
              user_id: authData.user.id,
            }]);

          if (employeeError) {
            console.error('Error creating employee record:', employeeError);
            // Don't throw here - user was created successfully
          }
        }
      }

      toast({
        title: "Success!",
        description: `User ${formData.fullName} has been created successfully and added to employee list.`,
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        fullName: "",
        role: "employee",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
        <CardDescription>
          Add a new employee, manager, or HR admin to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="hr">HR Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating User..." : "Create User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}