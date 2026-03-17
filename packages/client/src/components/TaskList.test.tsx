import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from './TaskList';
import type { Task } from '@todo/shared';
import { Priority } from '@todo/shared';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'タスク1',
    description: null,
    completed: false,
    priority: Priority.HIGH,
    dueDate: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    categoryId: null,
  },
  {
    id: '2',
    title: 'タスク2',
    description: '説明文',
    completed: true,
    priority: Priority.LOW,
    dueDate: '2026-03-20T00:00:00.000Z',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    categoryId: null,
  },
];

describe('TaskList', () => {
  it('タスクがない場合に空メッセージが表示される', () => {
    render(
      <TaskList
        tasks={[]}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
  });

  it('タスク一覧が表示される', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
  });

  it('タスクの数だけ TaskItem がレンダリングされる', () => {
    const { container } = render(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    const items = container.querySelectorAll('.task-item');
    expect(items).toHaveLength(2);
  });
});
