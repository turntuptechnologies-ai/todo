import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

// HTMLDialogElement の showModal/close をモック
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('ConfirmDialog', () => {
  it('メッセージが表示される', () => {
    render(
      <ConfirmDialog message="本当に削除しますか？" onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );
    expect(screen.getByText('本当に削除しますか？')).toBeInTheDocument();
  });

  it('マウント時に showModal が呼ばれる', () => {
    render(
      <ConfirmDialog message="確認" onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('確認ボタンをクリックすると onConfirm が呼ばれる', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog message="削除しますか？" onConfirm={onConfirm} onCancel={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: '確認', hidden: true }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it('キャンセルボタンをクリックすると onCancel が呼ばれる', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog message="削除しますか？" onConfirm={vi.fn()} onCancel={onCancel} />,
    );

    await user.click(screen.getByRole('button', { name: 'キャンセル', hidden: true }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });
});
