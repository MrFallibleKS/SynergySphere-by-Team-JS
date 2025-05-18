
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const AvailableProjects = () => {
  const { projects, addUserToProject } = useData();
  const { currentUser } = useAuth();
  const [joining, setJoining] = useState<string | null>(null);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // Get projects that the user is not a member of
  const availableProjects = projects.filter(project => 
    !project.members.includes(currentUser.id)
  );

  const handleJoinProject = async (projectId: string) => {
    try {
      setJoining(projectId);
      await addUserToProject(projectId, currentUser.id);
      toast.success("You've successfully joined the project!");
      setJoining(null);
    } catch (error) {
      toast.error("Failed to join project. Please try again.");
      setJoining(null);
    }
  };

  if (availableProjects.length === 0) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500">No available projects to join right now.</p>
          <p className="mt-2 text-sm text-gray-400">Check back later or create your own project!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableProjects.map(project => (
        <Card key={project.id} className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <Badge variant="outline">{project.members.length} Members</Badge>
            </div>
            <CardDescription className="line-clamp-2 mt-2">
              {project.description}
            </CardDescription>
            
            {/* Project tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            {project.managerName && (
              <div className="flex items-center text-sm mb-2">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span>Manager: {project.managerName}</span>
              </div>
            )}
            
            {/* Show tasks that need assignment */}
            {project.taskDetails && project.taskDetails.filter(t => !t.assigneeId).length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Available Tasks:
                </h4>
                <div className="space-y-1">
                  {project.taskDetails.filter(t => !t.assigneeId).slice(0, 2).map((task, idx) => (
                    <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-gray-500">Role: {task.role}</div>
                    </div>
                  ))}
                  {project.taskDetails.filter(t => !t.assigneeId).length > 2 && (
                    <div className="text-xs text-gray-500 mt-1">
                      +{project.taskDetails.filter(t => !t.assigneeId).length - 2} more roles
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link to={`/project/${project.id}`}>View Details</Link>
            </Button>
            <Button 
              onClick={() => handleJoinProject(project.id)}
              disabled={joining === project.id}
              size="sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {joining === project.id ? 'Joining...' : 'Join Project'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AvailableProjects;
