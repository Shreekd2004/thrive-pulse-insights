import { supabase } from "@/integrations/supabase/client";

export interface AuditLogParams {
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
}

class AuditService {
  async logAction(params: AuditLogParams) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { error } = await supabase
        .from('audit_logs' as any)
        .insert([{
          user_id: profile.id,
          action: params.action,
          resource_type: params.resource_type,
          resource_id: params.resource_id,
          old_values: params.old_values,
          new_values: params.new_values,
          ip_address: null, // Would be populated by edge function in production
          user_agent: navigator.userAgent,
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging audit action:', error);
    }
  }

  async logGoalCreated(goalId: string, goalData: any) {
    await this.logAction({
      action: 'CREATE_GOAL',
      resource_type: 'goal',
      resource_id: goalId,
      new_values: goalData,
    });
  }

  async logGoalUpdated(goalId: string, oldData: any, newData: any) {
    await this.logAction({
      action: 'UPDATE_GOAL',
      resource_type: 'goal',
      resource_id: goalId,
      old_values: oldData,
      new_values: newData,
    });
  }

  async logFeedbackGiven(feedbackId: string, feedbackData: any) {
    await this.logAction({
      action: 'GIVE_FEEDBACK',
      resource_type: 'feedback',
      resource_id: feedbackId,
      new_values: feedbackData,
    });
  }

  async logLeaveRequestCreated(leaveId: string, leaveData: any) {
    await this.logAction({
      action: 'CREATE_LEAVE_REQUEST',
      resource_type: 'leave_request',
      resource_id: leaveId,
      new_values: leaveData,
    });
  }

  async logLeaveRequestApproved(leaveId: string, status: string) {
    await this.logAction({
      action: 'APPROVE_LEAVE_REQUEST',
      resource_type: 'leave_request',
      resource_id: leaveId,
      new_values: { status },
    });
  }

  async logUserLogin() {
    await this.logAction({
      action: 'USER_LOGIN',
      resource_type: 'auth',
    });
  }

  async logUserLogout() {
    await this.logAction({
      action: 'USER_LOGOUT',
      resource_type: 'auth',
    });
  }

  async logReviewCycleCreated(cycleId: string, cycleData: any) {
    await this.logAction({
      action: 'CREATE_REVIEW_CYCLE',
      resource_type: 'review_cycle',
      resource_id: cycleId,
      new_values: cycleData,
    });
  }

  async logRecognitionGiven(recognitionId: string, recognitionData: any) {
    await this.logAction({
      action: 'GIVE_RECOGNITION',
      resource_type: 'recognition',
      resource_id: recognitionId,
      new_values: recognitionData,
    });
  }
}

export const auditService = new AuditService();