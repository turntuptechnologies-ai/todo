import type { Category, CreateCategoryInput, UpdateCategoryInput, Priority } from '@todo/shared';
import type { FilterState } from '../hooks/use-filter';
import { CategoryList } from './CategoryList';
import { FilterPanel } from './FilterPanel';

type Props = {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onCreateCategory: (input: CreateCategoryInput) => Promise<void>;
  onUpdateCategory: (id: string, input: UpdateCategoryInput) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  filter: FilterState;
  onChangePriority: (priority: Priority | null) => void;
  onChangeCompleted: (completed: boolean | null) => void;
  onResetFilter: () => void;
};

export function Sidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  filter,
  onChangePriority,
  onChangeCompleted,
  onResetFilter,
}: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar__section">
        <h2 className="sidebar__title">カテゴリ</h2>
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={onSelectCategory}
          onCreate={onCreateCategory}
          onUpdate={onUpdateCategory}
          onDelete={onDeleteCategory}
        />
      </div>

      <div className="sidebar__section">
        <h2 className="sidebar__title">フィルタ</h2>
        <FilterPanel
          filter={filter}
          onChangePriority={onChangePriority}
          onChangeCompleted={onChangeCompleted}
          onReset={onResetFilter}
        />
      </div>
    </aside>
  );
}
