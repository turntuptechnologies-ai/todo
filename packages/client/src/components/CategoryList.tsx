import { useState } from 'react';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@todo/shared';
import { CategoryForm } from './CategoryForm';
import { ConfirmDialog } from './ConfirmDialog';

type Props = {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
  onCreate: (input: CreateCategoryInput) => Promise<void>;
  onUpdate: (id: string, input: UpdateCategoryInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function CategoryList({
  categories,
  selectedCategoryId,
  onSelect,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const handleCreate = async (input: CreateCategoryInput | UpdateCategoryInput) => {
    await onCreate(input as CreateCategoryInput);
    setShowForm(false);
  };

  const handleUpdate = async (input: CreateCategoryInput | UpdateCategoryInput) => {
    if (editingCategory) {
      await onUpdate(editingCategory.id, input as UpdateCategoryInput);
      setEditingCategory(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingCategoryId) {
      await onDelete(deletingCategoryId);
      setDeletingCategoryId(null);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(false);
  };

  return (
    <div className="category-list">
      <button
        type="button"
        className={`category-list__item${selectedCategoryId === null ? ' category-list__item--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        <span className="category-list__color" style={{ backgroundColor: '#6b7280' }} />
        すべて
      </button>

      {categories.map((category) => (
        <div key={category.id} className="category-list__item-wrapper">
          {editingCategory?.id === category.id ? (
            <CategoryForm
              editingCategory={editingCategory}
              onSubmit={handleUpdate}
              onCancel={() => setEditingCategory(null)}
            />
          ) : (
            <button
              type="button"
              className={`category-list__item${selectedCategoryId === category.id ? ' category-list__item--active' : ''}`}
              onClick={() => onSelect(category.id)}
            >
              <span className="category-list__color" style={{ backgroundColor: category.color }} />
              <span className="category-list__name">{category.name}</span>
              <span className="category-list__actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="category-list__action-button"
                  onClick={() => handleEdit(category)}
                  aria-label="編集"
                >
                  ✎
                </button>
                <button
                  type="button"
                  className="category-list__action-button category-list__action-button--delete"
                  onClick={() => setDeletingCategoryId(category.id)}
                  aria-label="削除"
                >
                  ✕
                </button>
              </span>
            </button>
          )}
        </div>
      ))}

      {showForm ? (
        <CategoryForm
          editingCategory={null}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          type="button"
          className="category-list__add-button"
          onClick={() => setShowForm(true)}
        >
          + カテゴリを追加
        </button>
      )}

      {deletingCategoryId && (
        <ConfirmDialog
          message="このカテゴリを削除しますか？"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCategoryId(null)}
        />
      )}
    </div>
  );
}
