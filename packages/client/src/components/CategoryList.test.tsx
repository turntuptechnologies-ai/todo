import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoryList } from './CategoryList';
import type { Category } from '@todo/shared';

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
  {
    id: '2',
    name: 'プライベート',
    color: '#22c55e',
    createdAt: '2026-01-02T00:00:00.000Z',
  },
];

const defaultProps = () => ({
  categories: mockCategories,
  selectedCategoryId: null,
  onSelect: vi.fn(),
  onCreate: vi.fn().mockResolvedValue(undefined),
  onUpdate: vi.fn().mockResolvedValue(undefined),
  onDelete: vi.fn().mockResolvedValue(undefined),
});

describe('CategoryList', () => {
  it('「すべて」ボタンとカテゴリ一覧が表示される', () => {
    render(<CategoryList {...defaultProps()} />);

    expect(screen.getByText('すべて')).toBeInTheDocument();
    expect(screen.getByText('仕事')).toBeInTheDocument();
    expect(screen.getByText('プライベート')).toBeInTheDocument();
  });

  it('カテゴリが空の場合も「すべて」ボタンが表示される', () => {
    render(<CategoryList {...defaultProps()} categories={[]} />);
    expect(screen.getByText('すべて')).toBeInTheDocument();
  });

  it('「すべて」ボタンをクリックすると onSelect(null) が呼ばれる', async () => {
    const user = userEvent.setup();
    const props = defaultProps();
    render(<CategoryList {...props} />);

    await user.click(screen.getByText('すべて'));
    expect(props.onSelect).toHaveBeenCalledWith(null);
  });

  it('カテゴリをクリックすると onSelect が呼ばれる', async () => {
    const user = userEvent.setup();
    const props = defaultProps();
    render(<CategoryList {...props} />);

    await user.click(screen.getByText('仕事'));
    expect(props.onSelect).toHaveBeenCalledWith('1');
  });

  it('「+ カテゴリを追加」ボタンが表示される', () => {
    render(<CategoryList {...defaultProps()} />);
    expect(screen.getByText('+ カテゴリを追加')).toBeInTheDocument();
  });

  it('追加ボタンをクリックするとフォームが表示される', async () => {
    const user = userEvent.setup();
    render(<CategoryList {...defaultProps()} />);

    await user.click(screen.getByText('+ カテゴリを追加'));
    expect(screen.getByPlaceholderText('カテゴリ名')).toBeInTheDocument();
    expect(screen.getByText('追加')).toBeInTheDocument();
  });

  it('編集ボタンをクリックすると編集フォームが表示される', async () => {
    const user = userEvent.setup();
    render(<CategoryList {...defaultProps()} />);

    const editButtons = screen.getAllByLabelText('編集');
    await user.click(editButtons[0]);
    expect(screen.getByPlaceholderText('カテゴリ名')).toHaveValue('仕事');
    expect(screen.getByText('更新')).toBeInTheDocument();
  });

  it('削除ボタンをクリックすると確認ダイアログが表示される', async () => {
    const user = userEvent.setup();
    render(<CategoryList {...defaultProps()} />);

    const deleteButtons = screen.getAllByLabelText('削除');
    await user.click(deleteButtons[0]);
    expect(screen.getByText('このカテゴリを削除しますか？')).toBeInTheDocument();
  });

  it('選択中のカテゴリにアクティブクラスが付与される', () => {
    const { container } = render(<CategoryList {...defaultProps()} selectedCategoryId="1" />);
    const activeItems = container.querySelectorAll('.category-list__item--active');
    expect(activeItems).toHaveLength(1);
  });
});
