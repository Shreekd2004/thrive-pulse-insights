
import { useState } from "react";
import { Building, Users, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AddDepartmentForm from "@/components/forms/AddDepartmentForm";

export default function DepartmentsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: departments = [], refetch } = useQuery({
    queryKey: ['departments_with_counts'],
    queryFn: async () => {
      const { data: depts, error: deptsError } = await supabase
        .from('departments')
        .select('*');
      
      if (deptsError) throw deptsError;

      // Get employee counts for each department
      const departmentsWithCounts = await Promise.all(
        depts.map(async (dept) => {
          const { count, error: countError } = await supabase
            .from('employees')
            .select('*', { count: 'exact', head: true })
            .eq('department_id', dept.id);
          
          if (countError) throw countError;
          
          // Get manager for department (first manager in that department)
          const { data: manager } = await supabase
            .from('employees')
            .select('name')
            .eq('department_id', dept.id)
            .eq('role', 'manager')
            .limit(1)
            .single();

          return {
            ...dept,
            employeeCount: count || 0,
            manager: manager?.name || 'No Manager'
          };
        })
      );

      return departmentsWithCounts;
    },
  });

  const handleAddSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Departments</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddDepartmentForm 
              onClose={() => setIsAddDialogOpen(false)}
              onSuccess={handleAddSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">{dept.name}</h3>
                  <p className="text-gray-600 text-sm">{dept.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Employees</span>
                </div>
                <span className="text-sm font-medium">{dept.employeeCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Department Head</span>
                <span className="text-sm font-medium">{dept.manager}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full">
                Manage Department
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
