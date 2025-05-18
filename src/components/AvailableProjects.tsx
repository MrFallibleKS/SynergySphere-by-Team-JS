
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, User } from 'lucide-react';
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
          </CardHeader>
          <CardContent className="flex-grow">
            {project.managerName && (
              <div className="flex items-center text-sm mb-2">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span>Manager: {project.managerName}</span>
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
