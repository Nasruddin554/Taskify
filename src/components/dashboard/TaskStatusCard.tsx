
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TaskStatusCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  description: string;
  className?: string;
}

export default function TaskStatusCard({
  title,
  count,
  icon,
  description,
  className,
}: TaskStatusCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full animate-pulse-subtle">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{count}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
