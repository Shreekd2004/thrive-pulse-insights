import { Calendar, Clock, User, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OneOnOne {
  id: string;
  scheduled_date: string;
  duration_minutes: number;
  agenda: string;
  notes: string;
  status: string;
  employee_name?: string;
  manager_name?: string;
}

interface OneOnOneCardProps {
  meeting: OneOnOne;
  onEdit?: (meetingId: string) => void;
  onView?: (meetingId: string) => void;
  userRole: 'employee' | 'manager' | 'hr';
}

export default function OneOnOneCard({ meeting, onEdit, onView, userRole }: OneOnOneCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            1:1 Meeting
          </CardTitle>
          <Badge className={getStatusColor(meeting.status)}>
            {meeting.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(meeting.scheduled_date)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{meeting.duration_minutes} minutes</span>
          </div>
          
          {userRole === 'manager' && meeting.employee_name && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>with {meeting.employee_name}</span>
            </div>
          )}
          
          {userRole === 'employee' && meeting.manager_name && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>with {meeting.manager_name}</span>
            </div>
          )}
          
          {meeting.agenda && (
            <div className="flex items-start gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="line-clamp-2">{meeting.agenda}</span>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(meeting.id)}>
                View Details
              </Button>
            )}
            {onEdit && meeting.status !== 'completed' && (
              <Button variant="outline" size="sm" onClick={() => onEdit(meeting.id)}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}