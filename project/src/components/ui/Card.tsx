import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export default function Card({ children, className = '', glass = false }: CardProps) {
  const base = glass
    ? 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700/50'
    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800';
  return (
    <div className={`${base} rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}
