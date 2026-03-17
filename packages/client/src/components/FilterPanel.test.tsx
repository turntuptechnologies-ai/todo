import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Priority } from '@todo/shared';
import { FilterPanel } from './FilterPanel';
import type { FilterState } from '../hooks/use-filter';

const defaultFilter: FilterState = {
  categoryId: null,
  priority: null,
  completed: null,
};

describe('FilterPanel', () => {
  it('優先度と状態のドロップダウンが表示される', () => {
    render(
      <FilterPanel
        filter={defaultFilter}
        onChangePriority={vi.fn()}
        onChangeCompleted={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('優先度')).toBeInTheDocument();
    expect(screen.getByLabelText('状態')).toBeInTheDocument();
  });

  it('フィルタが未設定の場合はリセットボタンが表示されない', () => {
    render(
      <FilterPanel
        filter={defaultFilter}
        onChangePriority={vi.fn()}
        onChangeCompleted={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.queryByText('フィルタをリセット')).not.toBeInTheDocument();
  });

  it('フィルタが設定されているとリセットボタンが表示される', () => {
    const activeFilter: FilterState = { ...defaultFilter, priority: Priority.HIGH };
    render(
      <FilterPanel
        filter={activeFilter}
        onChangePriority={vi.fn()}
        onChangeCompleted={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByText('フィルタをリセット')).toBeInTheDocument();
  });

  it('優先度を変更すると onChangePriority が呼ばれる', async () => {
    const user = userEvent.setup();
    const onChangePriority = vi.fn();
    render(
      <FilterPanel
        filter={defaultFilter}
        onChangePriority={onChangePriority}
        onChangeCompleted={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText('優先度'), Priority.HIGH);
    expect(onChangePriority).toHaveBeenCalledWith(Priority.HIGH);
  });

  it('状態を変更すると onChangeCompleted が呼ばれる', async () => {
    const user = userEvent.setup();
    const onChangeCompleted = vi.fn();
    render(
      <FilterPanel
        filter={defaultFilter}
        onChangePriority={vi.fn()}
        onChangeCompleted={onChangeCompleted}
        onReset={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText('状態'), 'false');
    expect(onChangeCompleted).toHaveBeenCalledWith(false);
  });

  it('リセットボタンをクリックすると onReset が呼ばれる', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    const activeFilter: FilterState = { ...defaultFilter, completed: true };
    render(
      <FilterPanel
        filter={activeFilter}
        onChangePriority={vi.fn()}
        onChangeCompleted={vi.fn()}
        onReset={onReset}
      />,
    );

    await user.click(screen.getByText('フィルタをリセット'));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('優先度を「すべて」に戻すと null が渡される', async () => {
    const user = userEvent.setup();
    const onChangePriority = vi.fn();
    const activeFilter: FilterState = { ...defaultFilter, priority: Priority.HIGH };
    render(
      <FilterPanel
        filter={activeFilter}
        onChangePriority={onChangePriority}
        onChangeCompleted={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText('優先度'), '');
    expect(onChangePriority).toHaveBeenCalledWith(null);
  });
});
