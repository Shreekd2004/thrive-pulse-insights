
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: "teal" | "gold" | "red" | "green";
}

const colorMap = {
  teal: "bg-teal-500",
  gold: "bg-gold-500",
  red: "bg-red-500",
  green: "bg-green-500",
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={cn("stat-icon", colorMap[color])}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </div>
  );
}
