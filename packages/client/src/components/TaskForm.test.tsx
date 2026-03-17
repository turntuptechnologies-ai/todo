import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from './TaskForm';
import type { Task } from '@todo/shared';
import { Priority } from '@todo/shared';

const editingTask: Task = {
  id: '1',
  title: '既存タスク',
  description: '既存の説明',
  completed: false,
  priority: Priority.HIGH,
  dueDate: '2026-03-20T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  categoryId: null,
};

describe('TaskForm', () => {
  it('新規作成モードでフォームが空の状態で表示される', () => {
    render(<TaskForm editingTask={null} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/タイトル/)).toHaveValue('');
    expect(screen.getByLabelText(/説明/)).toHaveValue('');
    expect(screen.getByLabelText(/優先度/)).toHaveValue(Priority.MEDIUM);
    expect(screen.getByText('作成')).toBeInTheDocument();
  });

  it('編集モードで既存の値がフォームに表示される', () => {
    render(<TaskForm editingTask={editingTask} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/タイトル/)).toHaveValue('既存タスク');
    expect(screen.getByLabelText(/説明/)).toHaveValue('既存の説明');
    expect(screen.getByLabelText(/優先度/)).toHaveValue(Priority.HIGH);
    expect(screen.getByText('更新')).toBeInTheDocument();
  });

  it('タイトルが空の場合は送信ボタンが無効', () => {
    render(<TaskForm editingTask={null} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('作成')).toBeDisabled();
  });

  it('タイトルを入力すると送信ボタンが有効になる', async () => {
    const user = userEvent.setup();
    render(<TaskForm editingTask={null} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/タイトル/), '新しいタスク');
    expect(screen.getByText('作成')).toBeEnabled();
  });

  it('フォーム送信時に onSubmit が呼ばれる', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskForm editingTask={null} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/タイトル/), '新しいタスク');
    await user.click(screen.getByText('作成'));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: '新しいタスク', priority: Priority.MEDIUM }),
    );
  });

  it('キャンセルボタンをクリックすると onCancel が呼ばれる', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<TaskForm editingTask={null} onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByText('キャンセル'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('優先度を変更できる', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskForm editingTask={null} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/タイトル/), 'タスク');
    await user.selectOptions(screen.getByLabelText(/優先度/), Priority.HIGH);
    await user.click(screen.getByText('作成'));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ priority: Priority.HIGH }));
  });
});
