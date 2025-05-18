
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { getTasksByAssignee, getProjectById } = useData();
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  // Get user's tasks
  const userTasks = getTasksByAssignee(currentUser.id);
  
  // Calculate task statistics
  const todoCount = userTasks.filter(task => task.status === 'TODO').length;
  const inProgressCount = userTasks.filter(task => task.status === 'IN_PROGRESS').length;
  const completedCount = userTasks.filter(task => task.status === 'DONE').length;
  const totalTasks = userTasks.length;
  
  // Get unique projects the user is involved in
  const uniqueProjects = Array.from(
    new Set(userTasks.map(task => task.projectId))
  ).map(projectId => getProjectById(projectId));

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Your personal information and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border-2 border-gray-200">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow space-y-4 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                <p className="text-gray-500">{currentUser.email}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="py-4 text-center">
                    <p className="text-gray-500 text-sm">Total Tasks</p>
                    <p className="text-3xl font-bold mt-1">{totalTasks}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4 text-center">
                    <p className="text-gray-500 text-sm">To Do</p>
                    <p className="text-3xl font-bold mt-1">{todoCount}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4 text-center">
                    <p className="text-gray-500 text-sm">In Progress</p>
                    <p className="text-3xl font-bold mt-1">{inProgressCount}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4 text-center">
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-3xl font-bold mt-1">{completedCount}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Projects you are participating in</CardDescription>
        </CardHeader>
        <CardContent>
          {uniqueProjects.length > 0 ? (
            <div className="space-y-4">
              {uniqueProjects.map(project => {
                if (!project) return null;
                
                // Get project tasks for this user
                const projectTasks = userTasks.filter(task => task.projectId === project.id);
                const projectCompletedTasks = projectTasks.filter(task => task.status === 'DONE');
                const completionPercentage = Math.round((projectCompletedTasks.length / projectTasks.length) * 100);
                
                return (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                      </div>
                      <div className="mt-3 md:mt-0">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{projectTasks.length} tasks</Badge>
                          <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
                            {completionPercentage}% complete
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-synergy-600 h-2 rounded-full" 
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You are not currently assigned to any projects</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
