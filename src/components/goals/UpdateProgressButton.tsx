import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UpdateProgressButtonProps {
  goalId: string;
  currentProgress: number;
  onSuccess: () => void;
}

export default function UpdateProgressButton({ goalId, currentProgress, onSuccess }: UpdateProgressButtonProps) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(currentProgress.toString());
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    const newProgress = parseInt(progress);
    if (isNaN(newProgress) || newProgress < 0 || newProgress > 100) {
      toast({
        title: "Error",
        description: "Progress must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('goals')
        .update({ 
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'active'
        })
        .eq('id', goalId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal progress updated successfully",
      });
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Progress
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Update Progress</h3>
          <div>
            <Label htmlFor="progress">Progress (%)</Label>
            <Input
              id="progress"
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}