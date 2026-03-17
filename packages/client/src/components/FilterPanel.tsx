import { Priority } from '@todo/shared';
import type { FilterState } from '../hooks/use-filter';

type Props = {
  filter: FilterState;
  onChangePriority: (priority: Priority | null) => void;
  onChangeCompleted: (completed: boolean | null) => void;
  onReset: () => void;
};

export function FilterPanel({ filter, onChangePriority, onChangeCompleted, onReset }: Props) {
  const hasActiveFilter = filter.priority !== null || filter.completed !== null;

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChangePriority(value === '' ? null : (value as Priority));
  };

  const handleCompletedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      onChangeCompleted(null);
    } else {
      onChangeCompleted(value === 'true');
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel__field">
        <label className="filter-panel__label" htmlFor="filter-priority">
          優先度
        </label>
        <select
          id="filter-priority"
          className="filter-panel__select"
          value={filter.priority ?? ''}
          onChange={handlePriorityChange}
        >
          <option value="">すべて</option>
          <option value={Priority.HIGH}>高</option>
          <option value={Priority.MEDIUM}>中</option>
          <option value={Priority.LOW}>低</option>
        </select>
      </div>

      <div className="filter-panel__field">
        <label className="filter-panel__label" htmlFor="filter-completed">
          状態
        </label>
        <select
          id="filter-completed"
          className="filter-panel__select"
          value={filter.completed === null ? '' : String(filter.completed)}
          onChange={handleCompletedChange}
        >
          <option value="">すべて</option>
          <option value="false">未完了</option>
          <option value="true">完了</option>
        </select>
      </div>

      {hasActiveFilter && (
        <button type="button" className="filter-panel__reset" onClick={onReset}>
          フィルタをリセット
        </button>
      )}
    </div>
  );
}
