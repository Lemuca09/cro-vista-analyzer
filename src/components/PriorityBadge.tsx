
import React from 'react';
import { PriorityLevel } from '@/utils/types';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const priorityClasses = {
    high: "bg-red-50 text-red-700 border border-red-100",
    medium: "bg-amber-50 text-amber-700 border border-amber-100",
    low: "bg-green-50 text-green-700 border border-green-100"
  };
  
  return (
    <span className={cn(baseClasses, priorityClasses[priority], className)}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
    </span>
  );
};

export default PriorityBadge;
