
import { Calendar, Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function LeaveRequestPage() {
  const { user } = useAuth();
  
  const leaveRequests = [
    { id: 1, type: "Annual Leave", startDate: "2025-06-25", endDate: "2025-06-30", days: 5, status: "pending", reason: "Family vacation", submittedDate: "2025-06-15" },
    { id: 2, type: "Sick Leave", startDate: "2025-06-10", endDate: "2025-06-12", days: 2, status: "approved", reason: "Medical appointment", submittedDate: "2025-06-08" },
    { id: 3, type: "Personal Leave", startDate: "2025-05-20", endDate: "2025-05-21", days: 2, status: "rejected", reason: "Personal matters", submittedDate: "2025-05-15" },
  ];

  const leaveBalance = {
    annual: 15,
    sick: 10,
    personal: 5,
    used: 9
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leave Request</h1>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          New Leave Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Leave Days</p>
              <p className="text-2xl font-semibold">{leaveBalance.annual + leaveBalance.sick + leaveBalance.personal}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Used</p>
              <p className="text-2xl font-semibold">{leaveBalance.used}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-semibold">
                {(leaveBalance.annual + leaveBalance.sick + leaveBalance.personal) - leaveBalance.used}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold">{leaveRequests.filter(r => r.status === "pending").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-medium text-gray-900 mb-2">Annual Leave</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-semibold text-blue-600">{leaveBalance.annual}</span>
            <span className="text-sm text-gray-600">days</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-medium text-gray-900 mb-2">Sick Leave</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-semibold text-green-600">{leaveBalance.sick}</span>
            <span className="text-sm text-gray-600">days</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-medium text-gray-900 mb-2">Personal Leave</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-semibold text-purple-600">{leaveBalance.personal}</span>
            <span className="text-sm text-gray-600">days</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">My Leave Requests</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.startDate} to {request.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.days}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.submittedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
