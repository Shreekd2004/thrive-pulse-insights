
import { DollarSign, Search, Edit, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SalaryPage() {
  const salaryData = [
    { id: 1, employee: "John Smith", position: "Senior Developer", department: "Engineering", currentSalary: 85000, lastReview: "2025-01-15", nextReview: "2026-01-15" },
    { id: 2, employee: "Emma Davis", position: "Product Manager", department: "Product", currentSalary: 95000, lastReview: "2025-02-01", nextReview: "2026-02-01" },
    { id: 3, employee: "David Miller", position: "Designer", department: "Design", currentSalary: 70000, lastReview: "2024-12-10", nextReview: "2025-12-10" },
    { id: 4, employee: "Lisa Johnson", position: "Marketing Specialist", department: "Marketing", currentSalary: 65000, lastReview: "2025-03-01", nextReview: "2026-03-01" },
  ];

  const totalPayroll = salaryData.reduce((sum, emp) => sum + emp.currentSalary, 0);
  const avgSalary = totalPayroll / salaryData.length;

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
              <p className="text-2xl font-semibold">{salaryData.length}</p>
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
              {salaryData.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{emp.employee}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${emp.currentSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.lastReview}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.nextReview}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
