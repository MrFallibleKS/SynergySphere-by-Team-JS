import React from 'react';
const TaskStatusLegend = () => {
  return <div className="flex flex-wrap gap-3 my-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
      
      <div className="flex items-center">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        <span className="text-xs text-gray-600 dark:text-gray-300">Completed</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
        <span className="text-xs text-gray-600 dark:text-gray-300">Pending</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
        <span className="text-xs text-gray-600 dark:text-gray-300">Close Deadline (≤3 days)</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
        <span className="text-xs text-gray-600 dark:text-gray-300">Terminated</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
        <span className="text-xs text-gray-600 dark:text-gray-300">Available for Assignment</span>
      </div>
    </div>;
};
export default TaskStatusLegend;