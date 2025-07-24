import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  start_date?: string;
  end_date?: string;
  created_by_profile?: { full_name: string };
  assigned_to_profile?: { full_name: string };
}

interface ViewDetailsButtonProps {
  goal: Goal;
}

export default function ViewDetailsButton({ goal }: ViewDetailsButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{goal.title}</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Description</p>
              <p className="text-sm">{goal.description || 'No description available'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{goal.progress}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                goal.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}>
                {goal.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Start Date</p>
                <p className="text-sm">{goal.start_date || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">End Date</p>
                <p className="text-sm">{goal.end_date || 'Not set'}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600">Created By</p>
              <p className="text-sm">{goal.created_by_profile?.full_name || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned To</p>
              <p className="text-sm">{goal.assigned_to_profile?.full_name || 'N/A'}</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}