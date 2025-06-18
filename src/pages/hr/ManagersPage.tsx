
import { Users, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ManagersPage() {
  const managers = [
    { id: 1, name: "Sarah Wilson", department: "Engineering", teamSize: 8, performance: 92 },
    { id: 2, name: "Michael Brown", department: "Product", teamSize: 5, performance: 88 },
    { id: 3, name: "Jennifer Lee", department: "Marketing", teamSize: 6, performance: 85 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Managers</h1>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Manager
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search managers..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map((manager) => (
          <div key={manager.id} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{manager.name}</h3>
                <p className="text-gray-600">{manager.department}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Team Size:</span>
                <span className="text-sm font-medium">{manager.teamSize} employees</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Performance:</span>
                <span className="text-sm font-medium">{manager.performance}%</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">View Team</Button>
              <Button variant="outline" size="sm" className="flex-1">Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
