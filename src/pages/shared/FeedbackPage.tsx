
import { MessageSquare, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function FeedbackPage() {
  const { user } = useAuth();
  
  const feedbacks = [
    { 
      id: 1, 
      from: "Sarah Wilson", 
      to: "John Smith", 
      feedback: "Excellent work on the project. Your attention to detail and problem-solving skills were outstanding.", 
      sentiment: "positive", 
      sentimentScore: 0.8, 
      date: "2025-06-15" 
    },
    { 
      id: 2, 
      from: "Michael Brown", 
      to: "Emma Davis", 
      feedback: "Great leadership during the product launch. Could improve on communication frequency.", 
      sentiment: "neutral", 
      sentimentScore: 0.6, 
      date: "2025-06-14" 
    },
    { 
      id: 3, 
      from: "Sarah Wilson", 
      to: "David Miller", 
      feedback: "Design work needs improvement. Please focus on user experience guidelines.", 
      sentiment: "negative", 
      sentimentScore: 0.3, 
      date: "2025-06-13" 
    },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-800";
      case "neutral": return "bg-yellow-100 text-yellow-800";
      case "negative": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 0.7) return "😊";
    if (score >= 0.4) return "😐";
    return "😟";
  };

  const isManager = user?.role === "manager";
  const isHR = user?.role === "hr";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Feedback</h1>
        {isManager && (
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Give Feedback
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-2xl font-semibold">{feedbacks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Avg Sentiment</p>
              <p className="text-2xl font-semibold">
                {(feedbacks.reduce((acc, f) => acc + f.sentimentScore, 0) / feedbacks.length * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Positive</p>
              <p className="text-2xl font-semibold">{feedbacks.filter(f => f.sentiment === "positive").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {isHR ? `${feedback.from} → ${feedback.to}` : 
                     user?.role === "employee" ? `From: ${feedback.from}` : 
                     `To: ${feedback.to}`}
                  </p>
                  <p className="text-sm text-gray-500">{feedback.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getSentimentIcon(feedback.sentimentScore)}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getSentimentColor(feedback.sentiment)}`}>
                  {feedback.sentiment} ({(feedback.sentimentScore * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
