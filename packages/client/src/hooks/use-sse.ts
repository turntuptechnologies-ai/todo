import { useEffect, useRef } from 'react';
import type { Task } from '@todo/shared';

export type SSEHandlers = {
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  onTaskDeleted?: (id: string) => void;
};

export function useSSE(handlers: SSEHandlers): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const eventSource = new EventSource('/api/sse/tasks');

    eventSource.addEventListener('task:created', (event: MessageEvent) => {
      const data: { task: Task } = JSON.parse(event.data);
      handlersRef.current.onTaskCreated?.(data.task);
    });

    eventSource.addEventListener('task:updated', (event: MessageEvent) => {
      const data: { task: Task } = JSON.parse(event.data);
      handlersRef.current.onTaskUpdated?.(data.task);
    });

    eventSource.addEventListener('task:deleted', (event: MessageEvent) => {
      const data: { id: string } = JSON.parse(event.data);
      handlersRef.current.onTaskDeleted?.(data.id);
    });

    return () => {
      eventSource.close();
    };
  }, []);
}
