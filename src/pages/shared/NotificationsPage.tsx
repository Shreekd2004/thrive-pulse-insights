
import { Bell, Check, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function NotificationsPage() {
  const { user } = useAuth();
  
  const notifications = [
    {
      id: 1,
      title: "Goal Deadline Approaching",
      message: "Your goal 'Complete project documentation' is due in 3 days.",
      type: "goal",
      time: "2 hours ago",
      read: false,
      icon: "🎯"
    },
    {
      id: 2,
      title: "New Feedback Received",
      message: "Sarah Wilson has given you feedback on your recent project work.",
      type: "feedback",
      time: "1 day ago",
      read: false,
      icon: "💬"
    },
    {
      id: 3,
      title: "Leave Request Approved",
      message: "Your leave request for June 25-30 has been approved by HR.",
      type: "leave",
      time: "2 days ago",
      read: true,
      icon: "✅"
    },
    {
      id: 4,
      title: "Performance Review Scheduled",
      message: "Your quarterly performance review is scheduled for July 1st.",
      type: "assessment",
      time: "3 days ago",
      read: true,
      icon: "📅"
    },
    {
      id: 5,
      title: "Team Meeting Reminder",
      message: "Weekly team standup meeting starts in 30 minutes.",
      type: "meeting",
      time: "5 days ago",
      read: true,
      icon: "🤝"
    },
  ];

  // Filter notifications based on user role
  const filteredNotifications = user?.role === "hr" 
    ? [...notifications, 
        {
          id: 6,
          title: "New Leave Request",
          message: "John Smith has submitted a leave request for review.",
          type: "leave",
          time: "1 hour ago",
          read: false,
          icon: "📋"
        },
        {
          id: 7,
          title: "Monthly Report Ready",
          message: "The monthly HR performance report is ready for review.",
          type: "report",
          time: "6 hours ago",
          read: false,
          icon: "📊"
        }
      ]
    : user?.role === "manager"
    ? [...notifications,
        {
          id: 8,
          title: "Team Member Assessment Due",
          message: "Assessment for Emma Davis is due by end of week.",
          type: "assessment",
          time: "4 hours ago",
          read: false,
          icon: "📝"
        }
      ]
    : notifications;

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "goal": return "border-l-blue-500";
      case "feedback": return "border-l-green-500";
      case "leave": return "border-l-purple-500";
      case "assessment": return "border-l-yellow-500";
      case "meeting": return "border-l-teal-500";
      case "report": return "border-l-red-500";
      default: return "border-l-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600">{unreadCount} unread notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold">{filteredNotifications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-semibold">{unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Check className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-2xl font-semibold">{filteredNotifications.length - unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-semibold">
                {filteredNotifications.filter(n => n.time.includes('hour')).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`bg-white p-4 rounded-lg shadow border-l-4 ${getTypeColor(notification.type)} ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{notification.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                {!notification.read && (
                  <Button variant="outline" size="sm">
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
