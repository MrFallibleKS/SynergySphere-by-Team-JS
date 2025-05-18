
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Calendar, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import TaskDetail from '@/components/TaskDetail';

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
  
  // Check if task is overdue
  const isTaskOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'DONE';
  };
  
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-gray-500 mt-1">Manage and track all your tasks</p>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Tasks ({userTasks.length})</TabsTrigger>
          <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TaskList 
            tasks={userTasks} 
            formatDate={formatDate} 
            isTaskOverdue={isTaskOverdue}
            getProjectById={getProjectById}
            onViewTask={setSelectedTaskId}
          />
        </TabsContent>
        
        <TabsContent value="todo">
          <TaskList 
            tasks={todoTasks} 
            formatDate={formatDate} 
            isTaskOverdue={isTaskOverdue}
            getProjectById={getProjectById}
            onViewTask={setSelectedTaskId}
          />
        </TabsContent>
        
        <TabsContent value="in-progress">
          <TaskList 
            tasks={inProgressTasks} 
            formatDate={formatDate} 
            isTaskOverdue={isTaskOverdue}
            getProjectById={getProjectById}
            onViewTask={setSelectedTaskId}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <TaskList 
            tasks={completedTasks} 
            formatDate={formatDate} 
            isTaskOverdue={isTaskOverdue}
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
  isTaskOverdue: (dueDate: string, status: string) => boolean;
  getProjectById: (id: string) => any;
  onViewTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  formatDate, 
  isTaskOverdue, 
  getProjectById,
  onViewTask
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const project = getProjectById(task.projectId);
        const overdue = isTaskOverdue(task.dueDate, task.status);
        
        return (
          <Card 
            key={task.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              overdue ? 'border-red-300' : ''
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
                    : overdue 
                      ? 'text-red-600'
                      : 'text-gray-500'
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
