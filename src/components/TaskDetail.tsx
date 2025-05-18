
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, MessageSquare, Send, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface TaskDetailProps {
  taskId: string;
  onClose: () => void;
  onDelete: (taskId: string) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, onClose, onDelete }) => {
  const { getTaskById, getUserById, updateTask, getCommentsByTask, addComment, getProjectById } = useData();
  const { currentUser } = useAuth();
  
  const task = getTaskById(taskId);
  
  if (!task) {
    onClose();
    return null;
  }
  
  const project = getProjectById(task.projectId);
  const assignee = getUserById(task.assigneeId);
  const comments = getCommentsByTask(taskId);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editAssigneeId, setEditAssigneeId] = useState(task.assigneeId);
  const [editDueDate, setEditDueDate] = useState(new Date(task.dueDate).toISOString().split('T')[0]);
  const [editStatus, setEditStatus] = useState(task.status);
  
  // Comment state
  const [newComment, setNewComment] = useState('');
  
  // Save task edits
  const handleSaveChanges = () => {
    if (!editTitle.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    updateTask({
      ...task,
      title: editTitle,
      description: editDescription,
      assigneeId: editAssigneeId,
      dueDate: new Date(editDueDate).toISOString(),
      status: editStatus,
    });
    
    setIsEditing(false);
  };
  
  // Add comment
  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;
    
    addComment({
      content: newComment,
      authorId: currentUser.id,
      taskId: task.id,
    });
    
    setNewComment('');
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy');
  };
  
  // Format comment date
  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, h:mm a');
  };

  return (
    <>
      <DialogHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            {isEditing ? (
              <Input 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
                className="text-xl font-semibold mb-2"
              />
            ) : (
              <DialogTitle>{task.title}</DialogTitle>
            )}
            <DialogDescription>
              {project ? `In project: ${project.name}` : 'Loading project...'}
            </DialogDescription>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveChanges}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this task? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        onDelete(task.id);
                        onClose();
                      }}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </DialogHeader>
      
      <div className="mt-6 space-y-6">
        {/* Task Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            {isEditing ? (
              <Textarea 
                value={editDescription} 
                onChange={(e) => setEditDescription(e.target.value)} 
                className="min-h-[100px]"
              />
            ) : (
              <div className="text-sm">
                {task.description || <span className="text-gray-400 italic">No description provided</span>}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Assignee</h3>
              {isEditing && project ? (
                <Select value={editAssigneeId} onValueChange={setEditAssigneeId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {project.members.map((memberId) => {
                      const member = getUserById(memberId);
                      return member ? (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ) : null;
                    })}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center">
                  {assignee ? (
                    <>
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={assignee.avatar} />
                        <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{assignee.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Not assigned</span>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Due Date</h3>
              {isEditing ? (
                <Input 
                  type="date" 
                  value={editDueDate} 
                  onChange={(e) => setEditDueDate(e.target.value)} 
                />
              ) : (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className={new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'text-red-500' : ''}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              {isEditing ? (
                <Select value={editStatus} onValueChange={(value: any) => setEditStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={
                  task.status === 'TODO' ? 'outline' : 
                  task.status === 'IN_PROGRESS' ? 'secondary' : 
                  'default'
                }>
                  {task.status === 'TODO' ? 'To Do' : 
                  task.status === 'IN_PROGRESS' ? 'In Progress' : 
                  'Done'}
                </Badge>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2" />
                <span>{formatDate(task.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="pt-6 border-t">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Comments</h3>
          </div>
          
          {/* Comment list */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="text-gray-400 italic text-center py-4">
                No comments yet
              </p>
            ) : (
              comments.map(comment => {
                const author = getUserById(comment.authorId);
                
                return (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={author?.avatar} />
                      <AvatarFallback>{author?.name.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <span className="font-medium">{author?.name || 'Unknown user'}</span>
                        <span className="ml-2 text-gray-500 text-xs">
                          {formatCommentDate(comment.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1 text-sm">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* New comment form */}
          {currentUser && (
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea 
                  placeholder="Add a comment..." 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                  className="resize-none"
                />
                <div className="mt-2 flex justify-end">
                  <Button 
                    onClick={handleAddComment} 
                    disabled={!newComment.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskDetail;
