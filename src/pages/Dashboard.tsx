
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TaskSummary from '@/components/dashboard/TaskSummary';
import TaskDialog from '@/components/tasks/TaskDialog';
import TaskCard from '@/components/tasks/TaskCard';
import { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTask();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  
  const handleCreateTask = () => {
    setCurrentTask(undefined);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setIsTaskDialogOpen(false);
    setCurrentTask(undefined);
  };
  
  // Filter tasks
  const assignedTasks = user ? tasks.filter(task => task.assignedTo === user.id) : [];
  const createdTasks = user ? tasks.filter(task => task.createdBy === user.id) : [];
  
  // Get tasks due soon (next 3 days)
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  const tasksDueSoon = assignedTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= threeDaysFromNow && task.status !== 'completed';
  });
  
  // Sort by due date
  const sortedTasksDueSoon = [...tasksDueSoon].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  // Get overdue tasks
  const overdueTasks = assignedTasks.filter(task => {
    return new Date(task.dueDate) < today && task.status !== 'completed';
  });
  
  // Sort by most overdue first
  const sortedOverdueTasks = [...overdueTasks].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  // Get recently updated tasks
  const recentlyUpdatedTasks = [...tasks]
    .sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 5);

  return (
    <AppLayout>
      <DashboardHeader onCreateTask={handleCreateTask} />
      
      <TaskSummary />
      
      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="created">Created by Me</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Due Soon</CardTitle>
              <CardDescription>Tasks assigned to you due in the next 3 days</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedTasksDueSoon.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedTasksDueSoon.map(task => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No tasks due in the next 3 days
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overdue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Tasks</CardTitle>
              <CardDescription>Tasks assigned to you that are past the due date</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedOverdueTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedOverdueTasks.map(task => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No overdue tasks. Great job!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="created" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Created by Me</CardTitle>
              <CardDescription>Tasks you created and assigned to team members</CardDescription>
            </CardHeader>
            <CardContent>
              {createdTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {createdTasks.slice(0, 4).map(task => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  You haven't created any tasks yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Recently updated tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {recentlyUpdatedTasks.length > 0 ? (
            <div className="space-y-4">
              {recentlyUpdatedTasks.map(task => (
                <div key={task.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/40">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No recent activity
            </p>
          )}
        </CardContent>
      </Card>
      
      <TaskDialog
        task={currentTask}
        isOpen={isTaskDialogOpen}
        onClose={handleCloseTaskDialog}
      />
    </AppLayout>
  );
}
