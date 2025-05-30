import React from 'react';
import { cn } from '../../utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={cn("animate-spin rounded-full border-t-transparent border-2", sizeClasses[size], className)}>
      <div className="sr-only">Loading...</div>
    </div>
  );
};

export default Spinner;