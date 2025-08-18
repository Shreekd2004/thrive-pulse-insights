import { useState } from "react";
import { Calendar, Plus, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ScheduleOneOnOneForm from "@/components/forms/ScheduleOneOnOneForm";
import OneOnOneCard from "@/components/meetings/OneOnOneCard";

export default function OneOnOnesPage() {
  const { profile } = useAuth();
  const [showSchedule, setShowSchedule] = useState(false);
  const isManager = profile?.role === 'manager';

  const { data: oneOnOnes = [], refetch } = useQuery({
    queryKey: ['one-on-ones'],
    queryFn: async () => {
      const { data: meetings, error } = await supabase
        .from('one_on_ones')
        .select('*')
        .or(`employee_id.eq.${profile?.id},manager_id.eq.${profile?.id}`)
        .order('scheduled_date', { ascending: false });
      
      if (error) throw error;
      if (!meetings) return [];

      // Get profile names separately
      const profileIds = [...new Set([
        ...meetings.map(m => m.employee_id),
        ...meetings.map(m => m.manager_id)
      ])];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', profileIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

      return meetings.map(meeting => ({
        ...meeting,
        employee_name: profileMap.get(meeting.employee_id) || 'Unknown',
        manager_name: profileMap.get(meeting.manager_id) || 'Unknown'
      }));
    },
    enabled: !!profile?.id,
  });

  const upcomingMeetings = oneOnOnes.filter(m => 
    new Date(m.scheduled_date) > new Date() && m.status === 'scheduled'
  );
  const pastMeetings = oneOnOnes.filter(m => 
    new Date(m.scheduled_date) <= new Date() || m.status === 'completed'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">1:1 Meetings</h1>
        {isManager && (
          <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Schedule 1:1
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ScheduleOneOnOneForm 
                onClose={() => setShowSchedule(false)}
                onSuccess={() => {
                  refetch();
                  setShowSchedule(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold">{upcomingMeetings.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-semibold">{pastMeetings.filter(m => m.status === 'completed').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Meetings</p>
              <p className="text-2xl font-semibold">{oneOnOnes.length}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMeetings.map((meeting) => (
                <OneOnOneCard
                  key={meeting.id}
                  meeting={{
                    ...meeting,
                    employee_name: meeting.employee_name,
                    manager_name: meeting.manager_name,
                  }}
                  userRole={profile?.role || 'employee'}
                  onEdit={(id) => console.log('Edit meeting:', id)}
                  onView={(id) => console.log('View meeting:', id)}
                />
            ))}
          </div>
          {upcomingMeetings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming 1:1 meetings.</p>
              {isManager && (
                <p className="text-sm text-gray-400 mt-2">Schedule your first 1:1 to get started.</p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {pastMeetings.map((meeting) => (
              <div key={meeting.id} className="bg-white p-6 rounded-lg shadow border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      1:1 with {profile?.role === 'manager' ? meeting.employee_name : meeting.manager_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(meeting.scheduled_date).toLocaleDateString()} • {meeting.duration_minutes} minutes
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    meeting.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {meeting.status}
                  </span>
                </div>
                
                {meeting.agenda && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Agenda:</h4>
                    <p className="text-sm text-gray-600">{meeting.agenda}</p>
                  </div>
                )}
                
                {meeting.notes && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
                    <p className="text-sm text-gray-600">{meeting.notes}</p>
                  </div>
                )}
                
                <Button variant="outline" size="sm">
                  View Full Details
                </Button>
              </div>
            ))}
          </div>
          {pastMeetings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No meeting history yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}