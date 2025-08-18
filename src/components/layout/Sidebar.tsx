
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { 
  Users, 
  BarChart, 
  Building, 
  Calendar, 
  FileText, 
  Award, 
  Settings, 
  Target, 
  MessageSquare,
  DollarSign,
  Bell,
  LogOut,
  TrendingUp,
  Heart,
  UserCheck
} from "lucide-react";

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <BarChart className="h-5 w-5" />,
    roles: ["hr", "manager", "employee"],
  },
  {
    title: "Employees",
    path: "/employees",
    icon: <Users className="h-5 w-5" />,
    roles: ["hr"],
  },
  {
    title: "Managers",
    path: "/managers",
    icon: <Users className="h-5 w-5" />,
    roles: ["hr"],
  },
  {
    title: "Departments",
    path: "/departments",
    icon: <Building className="h-5 w-5" />,
    roles: ["hr"],
  },
  {
    title: "Leaves",
    path: "/leaves",
    icon: <Calendar className="h-5 w-5" />,
    roles: ["hr"],
  },
  {
    title: "Goals",
    path: "/goals",
    icon: <Target className="h-5 w-5" />,
    roles: ["hr", "manager", "employee"],
  },
  {
    title: "Feedback",
    path: "/feedback",
    icon: <MessageSquare className="h-5 w-5" />,
    roles: ["hr", "manager", "employee"],
  },
  {
    title: "Salary",
    path: "/salary",
    icon: <DollarSign className="h-5 w-5" />,
    roles: ["hr"],
  },
  {
    title: "Users",
    path: "/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["hr"],
  },
  {
    title: "Team Performance",
    path: "/team-performance",
    icon: <BarChart className="h-5 w-5" />,
    roles: ["hr", "manager"],
  },
  {
    title: "My Performance",
    path: "/my-performance",
    icon: <BarChart className="h-5 w-5" />,
    roles: ["manager", "employee"],
  },
  {
    title: "Leave Request",
    path: "/leave-request",
    icon: <FileText className="h-5 w-5" />,
    roles: ["manager", "employee"],
  },
  {
    title: "Assessments",
    path: "/assessments",
    icon: <FileText className="h-5 w-5" />,
    roles: ["hr", "manager", "employee"],
  },
  {
    title: "Reviews",
    path: "/reviews",
    icon: <UserCheck className="h-5 w-5" />,
    roles: ["hr", "manager", "employee"],
  },
  {
    title: "1:1 Meetings",
    path: "/one-on-ones",
    icon: <Calendar className="h-5 w-5" />,
    roles: ["hr", "manager", "employee"],
  },
  {
    title: "Recognition",
    path: "/recognition",
    icon: <Heart className="h-5 w-5" />,
    roles: ["hr", "manager", "employee"],
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: <TrendingUp className="h-5 w-5" />,
    roles: ["hr"],
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: <Bell className="h-5 w-5" />,
    roles: ["hr", "manager", "employee"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["hr", "manager", "employee"],
  },
];

export default function Sidebar() {
  const { user, profile, hasRole } = useAuth();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Extract the path without the role prefix for matching
    const pathParts = location.pathname.split("/");
    if (pathParts.length >= 3) {
      setCurrentPath(`/${pathParts.slice(2).join("/")}`);
    } else {
      setCurrentPath(location.pathname);
    }
  }, [location.pathname]);

  if (!user || !profile) return null;
  
  const role = profile.role;

  return (
    <div className="h-full w-64 bg-sidebar flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="text-white">
          <h1 className="text-lg font-bold">Thrive Pulse</h1>
          <p className="text-xs opacity-75">Insights</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-4 space-y-1 px-2">
        {navItems
          .filter(item => hasRole(item.roles))
          .map((item) => {
            const isActive = currentPath === item.path;
            const linkPath = `/${role}${item.path}`;
            
            return (
              <Link
                key={item.path}
                to={linkPath}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            );
        })}
      </div>
    </div>
  );
}
