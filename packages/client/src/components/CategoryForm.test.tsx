import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CategoryForm } from './CategoryForm';
import type { Category } from '@todo/shared';

const editingCategory: Category = {
  id: '1',
  name: '仕事',
  color: '#3b82f6',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('CategoryForm', () => {
  it('新規作成モードで空のフォームが表示される', () => {
    render(<CategoryForm editingCategory={null} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByPlaceholderText('カテゴリ名')).toHaveValue('');
    expect(screen.getByText('追加')).toBeInTheDocument();
  });

  it('編集モードで既存の値が表示される', () => {
    render(
      <CategoryForm editingCategory={editingCategory} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    expect(screen.getByPlaceholderText('カテゴリ名')).toHaveValue('仕事');
    expect(screen.getByText('更新')).toBeInTheDocument();
  });

  it('名前が空の場合は送信ボタンが無効', () => {
    render(<CategoryForm editingCategory={null} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('追加')).toBeDisabled();
  });

  it('名前を入力すると送信ボタンが有効になる', async () => {
    const user = userEvent.setup();
    render(<CategoryForm editingCategory={null} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('カテゴリ名'), '買い物');
    expect(screen.getByText('追加')).toBeEnabled();
  });

  it('フォーム送信時に onSubmit が呼ばれる', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CategoryForm editingCategory={null} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('カテゴリ名'), '買い物');
    await user.click(screen.getByText('追加'));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: '買い物' }),
    );
  });

  it('キャンセルボタンをクリックすると onCancel が呼ばれる', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<CategoryForm editingCategory={null} onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByText('キャンセル'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('色を選択できる', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CategoryForm editingCategory={null} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('カテゴリ名'), 'テスト');
    await user.click(screen.getByLabelText('色 #ef4444'));
    await user.click(screen.getByText('追加'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ color: '#ef4444' }),
    );
  });

  it('プリセットカラーが8色表示される', () => {
    render(<CategoryForm editingCategory={null} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    const colorButtons = screen.getAllByLabelText(/^色 #/);
    expect(colorButtons).toHaveLength(8);
  });
});
