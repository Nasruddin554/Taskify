
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AccountForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccountAction = (action: 'deactivate' | 'delete') => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (action === 'delete') {
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
          variant: "destructive",
        });
      } else if (action === 'deactivate') {
        toast({
          title: "Account deactivated",
          description: "Your account has been temporarily deactivated.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-orange-600 dark:text-orange-400">Account management</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Deactivating your account will temporarily hide your profile and content. 
              Deleting your account is permanent and cannot be undone.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button 
          variant="outline" 
          onClick={() => handleAccountAction('deactivate')}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Deactivate Account
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => handleAccountAction('delete')}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Delete Account
        </Button>
      </div>
    </div>
  );
}
