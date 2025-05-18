
import { useState, useCallback } from "react";
import { Project, Task, User, Comment, Notification, TaskFormData } from "@/types";
import { v4 as uuidv4 } from 'uuid';

// Function to generate a random date within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to get a random item from an array
const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Sample user roles
const roles = ["Frontend", "Backend", "UX Designer", "Project Manager", "QA Tester", "DevOps"];

// Sample project tags
const projectTags = [
  "Web Development", "Mobile App", "UI Design", "Backend", "AI", 
  "Machine Learning", "Frontend", "DevOps", "QA", "Marketing", "Finance", 
  "Analytics", "Data Science", "Cloud", "Security"
];

// Sample task tags
const taskTags = [
  "Bug", "Feature", "Enhancement", "Documentation", "Testing", "Design", 
  "API", "Database", "UI", "UX", "Performance", "Security", "Refactoring"
];

export const useSeedData = () => {
  const generateUsers = useCallback((): User[] => {
    const sampleUsers: User[] = [
      {
        id: uuidv4(),
        name: 'Alice Chen',
        email: 'alice@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        id: uuidv4(),
        name: 'Bob Smith',
        email: 'bob@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: uuidv4(),
        name: 'Carla Rodriguez',
        email: 'carla@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      {
        id: uuidv4(),
        name: 'Dan Johnson',
        email: 'dan@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg'
      },
      {
        id: uuidv4(),
        name: 'Eva Williams',
        email: 'eva@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/17.jpg'
      },
      {
        id: uuidv4(),
        name: 'Frank Green',
        email: 'frank@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
      }
    ];
    
    return sampleUsers;
  }, []);

  const generateTasks = useCallback((projectId: string, users: User[]): TaskFormData[] => {
    // Generate 4-5 tasks for a project
    const numTasks = Math.floor(Math.random() * 2) + 4;
    const tasks: TaskFormData[] = [];
    
    const sampleTaskNames = [
      "Fix Navbar Bug", "Create API Documentation", "Design Login Page", 
      "Implement Authentication", "Set Up CI/CD Pipeline", "Perform Load Testing",
      "Optimize Database Queries", "Create User Dashboard", "Set Up Analytics",
      "Fix Mobile Responsiveness", "Implement Form Validation", "Add Error Handling",
      "Create API Endpoints", "Design System Architecture", "Add Unit Tests",
      "Create Mobile Layout", "Fix Payment Integration", "Update Dependencies",
      "Migrate Database", "Set Up Monitoring", "Implement Search Functionality",
      "Create Data Visualization", "Improve Accessibility", "Optimize Performance"
    ];
    
    for (let i = 0; i < numTasks; i++) {
      // Random task status with weighted distribution
      const statuses: ["TODO", "IN_PROGRESS", "DONE"] = ["TODO", "IN_PROGRESS", "DONE"];
      const statusWeights = [0.5, 0.3, 0.2]; // 50% TODO, 30% IN_PROGRESS, 20% DONE
      
      let statusIndex = 0;
      const rand = Math.random();
      let weightSum = statusWeights[0];
      
      while (rand > weightSum && statusIndex < statusWeights.length - 1) {
        statusIndex++;
        weightSum += statusWeights[statusIndex];
      }
      
      const status = statuses[statusIndex];
      
      // Random priority
      const priorities: ["LOW", "MEDIUM", "HIGH"] = ["LOW", "MEDIUM", "HIGH"];
      const priority = getRandomItem(priorities);
      
      // Random assignee (with 20% chance of being unassigned)
      const assigneeId = Math.random() < 0.8 ? getRandomItem(users).id : '';
      
      // Random due date (from today to 30 days in the future)
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30);
      const dueDate = randomDate(today, futureDate);
      
      // Random role from the list
      const role = getRandomItem(roles);
      
      // Random task tags (1-3 tags)
      const numTags = Math.floor(Math.random() * 3) + 1;
      const tags: string[] = [];
      for (let j = 0; j < numTags; j++) {
        const tag = getRandomItem(taskTags);
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      }
      
      tasks.push({
        id: uuidv4(),
        title: getRandomItem(sampleTaskNames),
        description: `Task description for ${getRandomItem(sampleTaskNames)}. This is a sample task that needs to be completed as part of the project.`,
        assigneeId,
        dueDate: dueDate.toISOString(),
        status,
        priority,
        role,
        projectId,
        tags
      });
    }
    
    return tasks;
  }, []);

  const generateProjects = useCallback((users: User[]): Project[] => {
    // Sample project names
    const projectNames = [
      "Website Revamp", "AI Chatbot Development", "Mobile App Launch", "Marketing Campaign",
      "Backend Migration", "E-commerce Platform", "Customer Portal", "CRM Integration",
      "Data Analytics Dashboard", "Payment System Upgrade", "Mobile App Redesign",
      "Content Management System", "Inventory Management System", "Cloud Migration",
      "Security Audit Implementation", "Social Media Integration", "User Authentication System",
      "Performance Optimization", "Reporting Module"
    ];
    
    const projects: Project[] = [];
    
    // Generate 15-20 projects
    const numProjects = Math.floor(Math.random() * 6) + 15;
    
    for (let i = 0; i < numProjects; i++) {
      // Random project manager from users
      const managerId = getRandomItem(users).id;
      const managerUser = users.find(user => user.id === managerId);
      
      // Random deadline (from 30 to 90 days in the future)
      const today = new Date();
      const futureStartDate = new Date();
      futureStartDate.setDate(today.getDate() + 30);
      const futureEndDate = new Date();
      futureEndDate.setDate(today.getDate() + 90);
      const deadline = randomDate(futureStartDate, futureEndDate);
      
      // Random priority
      const priorities: ["LOW", "MEDIUM", "HIGH"] = ["LOW", "MEDIUM", "HIGH"];
      const priority = getRandomItem(priorities);
      
      // Random project tags (2-4 tags)
      const numTags = Math.floor(Math.random() * 3) + 2;
      const tags: string[] = [];
      for (let j = 0; j < numTags; j++) {
        const tag = getRandomItem(projectTags);
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      }
      
      // Random team members (3-5 members)
      const numMembers = Math.floor(Math.random() * 3) + 3;
      const members: string[] = [];
      for (let j = 0; j < numMembers; j++) {
        const userId = getRandomItem(users).id;
        if (!members.includes(userId)) {
          members.push(userId);
        }
      }
      
      // Generate a project
      const projectId = uuidv4();
      const projectTasks = generateTasks(projectId, users);
      const taskIds = projectTasks.map(task => task.id);
      
      projects.push({
        id: projectId,
        name: projectNames[i % projectNames.length],
        description: `This project aims to ${projectNames[i % projectNames.length].toLowerCase()} for our organization. It involves collaboration across multiple departments.`,
        imageBanner: `https://images.unsplash.com/photo-${1580000000000 + i * 10000}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80`,
        managerName: managerUser?.name,
        managerContact: managerUser?.email,
        managerId,
        tags,
        members,
        tasks: taskIds,
        taskDetails: projectTasks,
        deadline: deadline.toISOString(),
        priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return projects;
  }, [generateTasks]);

  const generateSeedData = useCallback(() => {
    const users = generateUsers();
    const projects = generateProjects(users);
    
    return {
      users,
      projects
    };
  }, [generateUsers, generateProjects]);

  return {
    generateSeedData
  };
};
