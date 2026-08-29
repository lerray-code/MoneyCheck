import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

function EmptyState({ icon = "📭", title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-10 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export default EmptyState;