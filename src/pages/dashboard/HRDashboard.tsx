
import { Users, Building, DollarSign, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export default function HRDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Employees"
          value={42}
          icon={<Users size={24} className="text-white" />}
          color="teal"
        />
        <StatCard
          title="Total Departments"
          value={8}
          icon={<Building size={24} className="text-white" />}
          color="gold"
        />
        <StatCard
          title="Monthly Payroll"
          value="$125,000"
          icon={<DollarSign size={24} className="text-white" />}
          color="red"
        />
      </div>

      <h2 className="text-xl font-semibold mt-8">Leave Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
        <StatCard
          title="Leave Applied"
          value={12}
          icon={<FileText size={24} className="text-white" />}
          color="teal"
        />
        <StatCard
          title="Leave Approved"
          value={8}
          icon={<CheckCircle size={24} className="text-white" />}
          color="green"
        />
        <StatCard
          title="Leave Pending"
          value={3}
          icon={<Clock size={24} className="text-white" />}
          color="gold"
        />
        <StatCard
          title="Leave Rejected"
          value={1}
          icon={<XCircle size={24} className="text-white" />}
          color="red"
        />
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {[
            { text: "New employee John Doe added to Engineering department", time: "2 hours ago" },
            { text: "Leave request approved for Sarah Wilson", time: "3 hours ago" },
            { text: "Performance assessment completed for Marketing team", time: "1 day ago" },
            { text: "Salary updated for 3 employees", time: "2 days ago" },
            { text: "New department 'Product Design' created", time: "3 days ago" },
          ].map((activity, i) => (
            <div key={i} className="flex justify-between pb-2 border-b border-gray-100">
              <span>{activity.text}</span>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
