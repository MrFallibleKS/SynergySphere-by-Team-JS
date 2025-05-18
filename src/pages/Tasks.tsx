
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Calendar, CheckCheck } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import TaskDetail from '@/components/TaskDetail';
import TaskStatusLegend from '@/components/TaskStatusLegend';

const Tasks: React.FC = () => {
  const { currentUser } = useAuth();
  const { getTasksByAssignee, getProjectById, deleteTask } = useData();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  // Get user's tasks
  const userTasks = getTasksByAssignee(currentUser.id);
  
  // Tasks by status
  const todoTasks = userTasks.filter(task => task.status === 'TODO');
  const inProgressTasks = userTasks.filter(task => task.status === 'IN_PROGRESS');
  const completedTasks = userTasks.filter(task => task.status === 'DONE');
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };
  
  // Check if task is overdue or close to deadline
  const getTaskStatus = (dueDate: string, status: string) => {
    if (status === 'DONE') return 'completed';
    
    const today = new Date();
    const taskDate = new Date(dueDate);
    const daysUntilDue = differenceInDays(taskDate, today);
    
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'close-deadline';
    return 'pending';
  };
  
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-gray-500 mt-1">Manage and track all your tasks</p>
      </div>
      
      <TaskStatusLegend />
      
      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="mb-6 w-full flex flex-wrap sm:flex-nowrap">
          <TabsTrigger value="all" className="flex-1">All Tasks ({userTasks.length})</TabsTrigger>
          <TabsTrigger value="todo" className="flex-1">To Do ({todoTasks.length})</TabsTrigger>
          <TabsTrigger value="in-progress" className="flex-1">In Progress ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TaskList 
            tasks={userTasks} 
            formatDate={formatDate} 
            getTaskStatus={getTaskStatus}
            getProjectById={getProjectById}
            onViewTask={setSelectedTaskId}
          />
        </TabsContent>
        
        <TabsContent value="todo">
          <TaskList 
            tasks={todoTasks} 
            formatDate={formatDate} 
            getTaskStatus={getTaskStatus}
            getProjectById={getProjectById}
            onViewTask={setSelectedTaskId}
          />
        </TabsContent>
        
        <TabsContent value="in-progress">
          <TaskList 
            tasks={inProgressTasks} 
            formatDate={formatDate} 
            getTaskStatus={getTaskStatus}
            getProjectById={getProjectById}
            onViewTask={setSelectedTaskId}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <TaskList 
            tasks={completedTasks} 
            formatDate={formatDate} 
            getTaskStatus={getTaskStatus}
            getProjectById={getProjectById}
            onViewTask={setSelectedTaskId}
          />
        </TabsContent>
      </Tabs>
      
      {/* Task Detail Modal */}
      {selectedTaskId && (
        <Dialog open={!!selectedTaskId} onOpenChange={(isOpen) => !isOpen && setSelectedTaskId(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <TaskDetail 
              taskId={selectedTaskId} 
              onClose={() => setSelectedTaskId(null)}
              onDelete={handleDeleteTask}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface TaskListProps {
  tasks: any[];
  formatDate: (date: string) => string;
  getTaskStatus: (dueDate: string, status: string) => string;
  getProjectById: (id: string) => any;
  onViewTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  formatDate, 
  getTaskStatus, 
  getProjectById,
  onViewTask
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const project = getProjectById(task.projectId);
        const status = getTaskStatus(task.dueDate, task.status);
        
        return (
          <Card 
            key={task.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              status === 'completed' ? 'border-green-300 bg-green-50 dark:bg-green-900/20' :
              status === 'overdue' || status === 'close-deadline' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' :
              status === 'pending' ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20' :
              ''
            }`}
            onClick={() => onViewTask(task.id)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h3 className={`font-medium ${task.status === 'DONE' ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h3>
                    <Badge 
                      variant={
                        task.status === 'TODO' ? 'outline' : 
                        task.status === 'IN_PROGRESS' ? 'secondary' : 
                        'default'
                      }
                      className="ml-3"
                    >
                      {task.status === 'TODO' ? 'To Do' : 
                      task.status === 'IN_PROGRESS' ? 'In Progress' : 
                      'Done'}
                    </Badge>
                  </div>
                  
                  {project && (
                    <Link 
                      to={`/project/${project.id}`}
                      className="text-sm text-gray-500 hover:text-synergy-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.name}
                    </Link>
                  )}
                </div>
                
                <div className={`mt-3 md:mt-0 text-sm flex items-center ${
                  task.status === 'DONE' 
                    ? 'text-green-600' 
                    : status === 'close-deadline' || status === 'overdue'
                      ? 'text-red-600'
                      : 'text-amber-600'
                }`}>
                  {task.status === 'DONE' ? (
                    <div className="flex items-center">
                      <CheckCheck className="h-4 w-4 mr-1" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Tasks;
