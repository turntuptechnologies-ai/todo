import { useState, useCallback, useMemo } from 'react';
import type { Task, Priority } from '@todo/shared';

export type FilterState = {
  categoryId: string | null;
  priority: Priority | null;
  completed: boolean | null;
};

export type UseFilterReturn = {
  filter: FilterState;
  setCategoryId: (categoryId: string | null) => void;
  setPriority: (priority: Priority | null) => void;
  setCompleted: (completed: boolean | null) => void;
  resetFilter: () => void;
  filterTasks: (tasks: Task[]) => Task[];
};

const INITIAL_FILTER: FilterState = {
  categoryId: null,
  priority: null,
  completed: null,
};

export function useFilter(): UseFilterReturn {
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);

  const setCategoryId = useCallback((categoryId: string | null) => {
    setFilter((prev) => ({ ...prev, categoryId }));
  }, []);

  const setPriority = useCallback((priority: Priority | null) => {
    setFilter((prev) => ({ ...prev, priority }));
  }, []);

  const setCompleted = useCallback((completed: boolean | null) => {
    setFilter((prev) => ({ ...prev, completed }));
  }, []);

  const resetFilter = useCallback(() => {
    setFilter(INITIAL_FILTER);
  }, []);

  const filterTasks = useCallback(
    (tasks: Task[]): Task[] => {
      return tasks.filter((task) => {
        if (filter.categoryId !== null && task.categoryId !== filter.categoryId) {
          return false;
        }
        if (filter.priority !== null && task.priority !== filter.priority) {
          return false;
        }
        if (filter.completed !== null && task.completed !== filter.completed) {
          return false;
        }
        return true;
      });
    },
    [filter],
  );

  return useMemo(
    () => ({ filter, setCategoryId, setPriority, setCompleted, resetFilter, filterTasks }),
    [filter, setCategoryId, setPriority, setCompleted, resetFilter, filterTasks],
  );
}
