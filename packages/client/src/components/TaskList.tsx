import type { Task } from '@todo/shared';
import { TaskItem } from './TaskItem';

type Props = {
  tasks: Task[];
  onToggleComplete: (id: string, currentCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export function TaskList({ tasks, onToggleComplete, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return <p className="task-list__empty">タスクがありません</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
