import { Award, Heart, Star, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Recognition {
  id: string;
  title: string;
  message: string;
  recognition_type: string;
  from_user_name: string;
  to_user_name: string;
  created_at: string;
  is_public: boolean;
}

interface RecognitionCardProps {
  recognition: Recognition;
}

export default function RecognitionCard({ recognition }: RecognitionCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="h-5 w-5 text-yellow-600" />;
      case 'milestone': return <Star className="h-5 w-5 text-blue-600" />;
      case 'peer_nomination': return <Heart className="h-5 w-5 text-red-600" />;
      default: return <Award className="h-5 w-5 text-green-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-50 border-yellow-200';
      case 'milestone': return 'bg-blue-50 border-blue-200';
      case 'peer_nomination': return 'bg-red-50 border-red-200';
      default: return 'bg-green-50 border-green-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className={`${getTypeColor(recognition.recognition_type)} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {getTypeIcon(recognition.recognition_type)}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{recognition.title}</h3>
            <p className="text-sm text-gray-600">
              {recognition.from_user_name} → {recognition.to_user_name}
            </p>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(recognition.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">{recognition.message}</p>
        
        <div className="flex items-center gap-2 mt-4">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-primary/10">
              {getInitials(recognition.from_user_name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600">
            from {recognition.from_user_name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}