import type { Task } from '@todo/shared';
import { Priority } from '@todo/shared';

type Props = {
  task: Task;
  onToggleComplete: (id: string, currentCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.LOW]: '低',
  [Priority.MEDIUM]: '中',
  [Priority.HIGH]: '高',
};

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  return date.toLocaleDateString('ja-JP');
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: Props) {
  const itemClass = `task-item${task.completed ? ' task-item--completed' : ''}`;
  const priorityClass = `task-item__priority task-item__priority--${task.priority.toLowerCase()}`;

  return (
    <div className={itemClass}>
      <div className="task-item__main">
        <label className="task-item__checkbox-label">
          <input
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id, task.completed)}
          />
          <span className="task-item__title">{task.title}</span>
        </label>
        <div className="task-item__meta">
          <span className={priorityClass}>{PRIORITY_LABELS[task.priority]}</span>
          {task.dueDate && (
            <span className="task-item__due-date">{formatDueDate(task.dueDate)}</span>
          )}
        </div>
      </div>
      {task.description && <p className="task-item__description">{task.description}</p>}
      <div className="task-item__actions">
        <button
          type="button"
          className="task-item__button task-item__button--edit"
          onClick={() => onEdit(task)}
        >
          編集
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--delete"
          onClick={() => onDelete(task.id)}
        >
          削除
        </button>
      </div>
    </div>
  );
}
