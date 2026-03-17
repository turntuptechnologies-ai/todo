import { useState, useEffect } from 'react';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@todo/shared';

type Props = {
  editingCategory: Category | null;
  onSubmit: (input: CreateCategoryInput | UpdateCategoryInput) => void;
  onCancel: () => void;
};

const PRESET_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#6b7280',
];

const DEFAULT_COLOR = '#6b7280';

export function CategoryForm({ editingCategory, onSubmit, onCancel }: Props) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setColor(editingCategory.color);
    } else {
      setName('');
      setColor(DEFAULT_COLOR);
    }
  }, [editingCategory]);

  const isValid = name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    if (editingCategory) {
      const input: UpdateCategoryInput = {
        name: name.trim(),
        color,
      };
      onSubmit(input);
    } else {
      const input: CreateCategoryInput = {
        name: name.trim(),
        color,
      };
      onSubmit(input);
    }
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <div className="category-form__field">
        <input
          className="category-form__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="カテゴリ名"
          autoFocus
        />
      </div>
      <div className="category-form__colors">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            className={`category-form__color-button${c === color ? ' category-form__color-button--active' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
            aria-label={`色 ${c}`}
          />
        ))}
      </div>
      <div className="category-form__actions">
        <button
          type="button"
          className="category-form__button category-form__button--cancel"
          onClick={onCancel}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="category-form__button category-form__button--submit"
          disabled={!isValid}
        >
          {editingCategory ? '更新' : '追加'}
        </button>
      </div>
    </form>
  );
}
