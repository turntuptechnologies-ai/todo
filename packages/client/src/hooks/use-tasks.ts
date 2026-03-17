import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@todo/shared';
import * as taskApi from '../api/task-api';
import { useSSE } from './use-sse';

export type UseTasksReturn = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string, currentCompleted: boolean) => Promise<void>;
};

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初回ロード
  useEffect(() => {
    taskApi
      .fetchTasks()
      .then((data) => {
        setTasks(data);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // SSE でリアルタイム更新
  useSSE({
    onTaskCreated: (task) => {
      setTasks((prev) => {
        // 重複防止
        if (prev.some((t) => t.id === task.id)) return prev;
        return [task, ...prev];
      });
    },
    onTaskUpdated: (task) => {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    },
    onTaskDeleted: (id) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
  });

  const createTask = useCallback(async (input: CreateTaskInput) => {
    try {
      await taskApi.createTask(input);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'タスクの作成に失敗しました';
      setError(message);
    }
  }, []);

  const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
    try {
      await taskApi.updateTask(id, input);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'タスクの更新に失敗しました';
      setError(message);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskApi.deleteTask(id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'タスクの削除に失敗しました';
      setError(message);
    }
  }, []);

  const toggleComplete = useCallback(
    async (id: string, currentCompleted: boolean) => {
      await updateTask(id, { completed: !currentCompleted });
    },
    [updateTask],
  );

  return { tasks, loading, error, createTask, updateTask, deleteTask, toggleComplete };
}
