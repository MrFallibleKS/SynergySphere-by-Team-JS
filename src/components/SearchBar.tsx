
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ProjectFormData, TaskFormData } from '@/types';

type SearchResult = {
  id: string;
  title: string;
  type: 'project' | 'task';
  tags?: string[];
  projectId?: string;
};

const SearchBar: React.FC = () => {
  const { projects, tasks } = useData();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim() || !open) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Search in projects
    const matchingProjects = projects.map(project => ({
      id: project.id,
      title: project.name,
      type: 'project' as const,
      tags: project.tags,
    })).filter(item => {
      const matchesTitle = item.title.toLowerCase().includes(lowerQuery);
      const matchesTags = item.tags?.some(tag => 
        tag.toLowerCase().includes(lowerQuery)
      );
      return matchesTitle || matchesTags;
    });

    // Search in tasks
    const matchingTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      type: 'task' as const,
      projectId: task.projectId,
    })).filter(item => 
      item.title.toLowerCase().includes(lowerQuery)
    );

    setResults([...matchingProjects, ...matchingTasks]);
  }, [query, projects, tasks, open]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    if (result.type === 'project') {
      navigate(`/project/${result.id}`);
    } else if (result.type === 'task' && result.projectId) {
      // Navigate to the task's project
      navigate(`/project/${result.projectId}`);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="relative h-9 w-full md:w-64 justify-start text-muted-foreground sm:pr-12 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Search projects and tasks...</span>
        <span className="inline sm:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search projects and tasks..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <>
              <CommandGroup heading="Projects">
                {results
                  .filter(result => result.type === 'project')
                  .map(result => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <span>{result.title}</span>
                      </div>
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex gap-1 max-w-[50%] overflow-hidden">
                          {result.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {result.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{result.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>

              <CommandGroup heading="Tasks">
                {results
                  .filter(result => result.type === 'task')
                  .map(result => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                    >
                      {result.title}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
