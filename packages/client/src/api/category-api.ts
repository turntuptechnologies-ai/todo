import type { ApiResponse, Category, CreateCategoryInput, UpdateCategoryInput } from '@todo/shared';

const BASE_URL = '/api/categories';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody && typeof errorBody === 'object' && 'error' in errorBody
        ? (errorBody as { error: { message: string } }).error.message
        : `HTTP エラー: ${response.status}`;
    throw new Error(message);
  }
  const body: ApiResponse<T> = await response.json();
  return body.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(BASE_URL);
  return handleResponse<Category[]>(response);
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Category>(response);
}

export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Category>(response);
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody && typeof errorBody === 'object' && 'error' in errorBody
        ? (errorBody as { error: { message: string } }).error.message
        : `HTTP エラー: ${response.status}`;
    throw new Error(message);
  }
}
