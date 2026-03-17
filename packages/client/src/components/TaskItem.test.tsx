import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskItem } from './TaskItem';
import type { Task } from '@todo/shared';
import { Priority } from '@todo/shared';

const baseTask: Task = {
  id: '1',
  title: 'テストタスク',
  description: null,
  completed: false,
  priority: Priority.MEDIUM,
  dueDate: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  categoryId: null,
};

describe('TaskItem', () => {
  it('タスクのタイトルが表示される', () => {
    render(
      <TaskItem task={baseTask} onToggleComplete={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });

  it('優先度ラベルが表示される', () => {
    render(
      <TaskItem
        task={{ ...baseTask, priority: Priority.HIGH }}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('高')).toBeInTheDocument();
  });

  it('説明がある場合に表示される', () => {
    render(
      <TaskItem
        task={{ ...baseTask, description: 'タスクの説明文' }}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('タスクの説明文')).toBeInTheDocument();
  });

  it('期限がある場合に表示される', () => {
    render(
      <TaskItem
        task={{ ...baseTask, dueDate: '2026-03-20T00:00:00.000Z' }}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('2026/3/20')).toBeInTheDocument();
  });

  it('完了済みタスクに completed クラスが付与される', () => {
    const { container } = render(
      <TaskItem
        task={{ ...baseTask, completed: true }}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(container.querySelector('.task-item--completed')).toBeInTheDocument();
  });

  it('チェックボックスをクリックすると onToggleComplete が呼ばれる', async () => {
    const user = userEvent.setup();
    const onToggleComplete = vi.fn();
    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('checkbox'));
    expect(onToggleComplete).toHaveBeenCalledWith('1', false);
  });

  it('編集ボタンをクリックすると onEdit が呼ばれる', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <TaskItem task={baseTask} onToggleComplete={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />,
    );

    await user.click(screen.getByText('編集'));
    expect(onEdit).toHaveBeenCalledWith(baseTask);
  });

  it('削除ボタンをクリックすると onDelete が呼ばれる', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <TaskItem task={baseTask} onToggleComplete={vi.fn()} onEdit={vi.fn()} onDelete={onDelete} />,
    );

    await user.click(screen.getByText('削除'));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
