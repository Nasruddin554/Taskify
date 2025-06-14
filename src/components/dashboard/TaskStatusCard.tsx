
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
    <Card className={`bg-white dark:bg-[#20212a]/80 dark:backdrop-blur-md dark:border-zinc-800 text-gray-900 dark:text-gray-50 rounded-xl shadow ${className || ''} border border-gray-100`}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{count}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{description}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
