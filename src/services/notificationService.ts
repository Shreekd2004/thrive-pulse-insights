import { supabase } from "@/integrations/supabase/client";

export interface CreateNotificationParams {
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  category?: string;
  action_url?: string;
}

class NotificationService {
  async createNotification(params: CreateNotificationParams) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: params.user_id,
          title: params.title,
          message: params.message,
          type: params.type || 'info',
          category: params.category || 'general',
          action_url: params.action_url,
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  async createGoalDeadlineReminder(userId: string, goalTitle: string, daysUntilDeadline: number) {
    await this.createNotification({
      user_id: userId,
      title: "Goal Deadline Approaching",
      message: `Your goal "${goalTitle}" is due in ${daysUntilDeadline} days.`,
      type: 'warning',
      category: 'goals',
    });
  }

  async createFeedbackNotification(userId: string, fromUserName: string) {
    await this.createNotification({
      user_id: userId,
      title: "New Feedback Received",
      message: `${fromUserName} has given you feedback on your recent work.`,
      type: 'info',
      category: 'feedback',
    });
  }

  async createLeaveApprovalNotification(userId: string, status: 'approved' | 'rejected') {
    await this.createNotification({
      user_id: userId,
      title: `Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your leave request has been ${status}.`,
      type: status === 'approved' ? 'success' : 'warning',
      category: 'leave',
    });
  }

  async createReviewReminderNotification(userId: string, reviewType: string, dueDate: string) {
    await this.createNotification({
      user_id: userId,
      title: "Performance Review Due",
      message: `Your ${reviewType} review is due on ${dueDate}.`,
      type: 'warning',
      category: 'reviews',
    });
  }

  async createRecognitionNotification(userId: string, fromUserName: string, title: string) {
    await this.createNotification({
      user_id: userId,
      title: "Recognition Received",
      message: `${fromUserName} recognized you: "${title}"`,
      type: 'success',
      category: 'recognition',
    });
  }

  async createOneOnOneReminderNotification(userId: string, meetingDate: string, participantName: string) {
    await this.createNotification({
      user_id: userId,
      title: "1:1 Meeting Reminder",
      message: `You have a 1:1 meeting with ${participantName} scheduled for ${meetingDate}.`,
      type: 'info',
      category: 'meetings',
    });
  }
}

export const notificationService = new NotificationService();