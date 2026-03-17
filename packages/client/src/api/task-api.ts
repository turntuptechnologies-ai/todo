import type { ApiResponse, Task, CreateTaskInput, UpdateTaskInput } from '@todo/shared';

const BASE_URL = '/api/tasks';

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

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(BASE_URL);
  return handleResponse<Task[]>(response);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(response);
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(response);
}

export async function deleteTask(id: string): Promise<void> {
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
