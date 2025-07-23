
import { DollarSign, Search, Edit, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function SalaryPage() {
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [newSalary, setNewSalary] = useState<string>("");

  const { data: employees = [], refetch } = useQuery({
    queryKey: ['employees-salary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id,
          name,
          role,
          salary,
          hire_date,
          departments!inner(name)
        `);
      if (error) throw error;
      return data || [];
    },
  });

  const totalPayroll = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  const avgSalary = employees.length > 0 ? totalPayroll / employees.length : 0;

  const handleSalaryUpdate = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ salary: parseFloat(newSalary) })
        .eq('id', employeeId);

      if (error) throw error;
      
      setEditingEmployee(null);
      setNewSalary("");
      refetch();
    } catch (error) {
      console.error('Error updating salary:', error);
      alert('Failed to update salary');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Salary Management</h1>
        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          🔒 HR Only - Confidential
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Payroll</p>
              <p className="text-2xl font-semibold">${totalPayroll.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Average Salary</p>
              <p className="text-2xl font-semibold">${avgSalary.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Employees</p>
              <p className="text-2xl font-semibold">{employees.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search employees..." className="pl-10" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length > 0 ? employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.departments?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {editingEmployee === emp.id ? (
                      <Input
                        type="number"
                        value={newSalary}
                        onChange={(e) => setNewSalary(e.target.value)}
                        className="w-24"
                        placeholder="Salary"
                      />
                    ) : (
                      `$${emp.salary?.toLocaleString() || 'Not set'}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.hire_date || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {emp.hire_date ? new Date(new Date(emp.hire_date).getTime() + 365*24*60*60*1000).toISOString().split('T')[0] : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingEmployee === emp.id ? (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleSalaryUpdate(emp.id)}
                          disabled={!newSalary}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setEditingEmployee(null);
                            setNewSalary("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingEmployee(emp.id);
                          setNewSalary(emp.salary?.toString() || "");
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No employees found. Add employees first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
