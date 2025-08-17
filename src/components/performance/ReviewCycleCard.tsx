import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReviewCycle {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

interface ReviewCycleCardProps {
  cycle: ReviewCycle;
  onManage?: (cycleId: string) => void;
}

export default function ReviewCycleCard({ cycle, onManage }: ReviewCycleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{cycle.name}</CardTitle>
          <Badge className={getStatusColor(cycle.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(cycle.status)}
              {cycle.status}
            </div>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{cycle.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>0 reviews completed</span>
          </div>
          
          {onManage && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onManage(cycle.id)}
              className="w-full mt-3"
            >
              Manage Cycle
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}