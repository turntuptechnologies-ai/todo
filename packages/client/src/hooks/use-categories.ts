import { useState, useEffect, useCallback } from 'react';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@todo/shared';
import * as categoryApi from '../api/category-api';

export type UseCategoriesReturn = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  createCategory: (input: CreateCategoryInput) => Promise<void>;
  updateCategory: (id: string, input: UpdateCategoryInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
};

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryApi.fetchCategories();
      setCategories(data);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'カテゴリの取得に失敗しました';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回ロード
  useEffect(() => {
    void refetch();
  }, [refetch]);

  const createCategory = useCallback(
    async (input: CreateCategoryInput) => {
      try {
        await categoryApi.createCategory(input);
        await refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'カテゴリの作成に失敗しました';
        setError(message);
      }
    },
    [refetch],
  );

  const updateCategory = useCallback(
    async (id: string, input: UpdateCategoryInput) => {
      try {
        await categoryApi.updateCategory(id, input);
        await refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'カテゴリの更新に失敗しました';
        setError(message);
      }
    },
    [refetch],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await categoryApi.deleteCategory(id);
        await refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'カテゴリの削除に失敗しました';
        setError(message);
      }
    },
    [refetch],
  );

  return { categories, loading, error, createCategory, updateCategory, deleteCategory, refetch };
}
