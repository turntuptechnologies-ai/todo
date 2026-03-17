import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sidebar } from './Sidebar';
import type { Category } from '@todo/shared';
import type { FilterState } from '../hooks/use-filter';

// HTMLDialogElement の showModal/close をモック
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

const mockCategories: Category[] = [
  {
    id: '1',
    name: '仕事',
    color: '#3b82f6',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

const defaultFilter: FilterState = {
  categoryId: null,
  priority: null,
  completed: null,
};

const defaultProps = () => ({
  categories: mockCategories,
  selectedCategoryId: null,
  onSelectCategory: vi.fn(),
  onCreateCategory: vi.fn().mockResolvedValue(undefined),
  onUpdateCategory: vi.fn().mockResolvedValue(undefined),
  onDeleteCategory: vi.fn().mockResolvedValue(undefined),
  filter: defaultFilter,
  onChangePriority: vi.fn(),
  onChangeCompleted: vi.fn(),
  onResetFilter: vi.fn(),
});

describe('Sidebar', () => {
  it('「カテゴリ」と「フィルタ」のセクションタイトルが表示される', () => {
    render(<Sidebar {...defaultProps()} />);

    expect(screen.getByText('カテゴリ')).toBeInTheDocument();
    expect(screen.getByText('フィルタ')).toBeInTheDocument();
  });

  it('CategoryList の内容が表示される', () => {
    render(<Sidebar {...defaultProps()} />);

    expect(screen.getByText('仕事')).toBeInTheDocument();
    expect(screen.getByText('+ カテゴリを追加')).toBeInTheDocument();
  });

  it('FilterPanel の内容が表示される', () => {
    render(<Sidebar {...defaultProps()} />);

    expect(screen.getByLabelText('優先度')).toBeInTheDocument();
    expect(screen.getByLabelText('状態')).toBeInTheDocument();
  });
});
