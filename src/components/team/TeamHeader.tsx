
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedContainer } from "@/components/ui/animated-container";

interface TeamHeaderProps {
  teamSize: number;
  avgCompletionRate: number;
  onInviteClick: () => void;
}

export default function TeamHeader({
  teamSize,
  avgCompletionRate,
  onInviteClick
}: TeamHeaderProps) {
  return (
    <AnimatedContainer animation="fade" delay={0.2} duration={0.6}>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your team members
            </p>
          </div>
          <AnimatedContainer animation="fade" delay={0.3} duration={0.4}>
            <Button 
              onClick={onInviteClick}
              className="mt-4 sm:mt-0 gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </AnimatedContainer>
        </div>

        <AnimatedContainer 
          className="mt-6 p-4 bg-muted rounded-lg"
          animation="scale"
          delay={0.4}
          duration={0.5}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <div className="p-2 rounded-full bg-primary/10">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Team Size</div>
                <div className="text-xl font-bold">{teamSize} members</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg. Task Completion</div>
                <div className="text-xl font-bold">
                  {avgCompletionRate}%
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </AnimatedContainer>
  );
}
