import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom に EventSource がないためモックする
class MockEventSource {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;
  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSED = 2;
  readyState = 0;
  url: string;
  withCredentials = false;
  onopen: ((ev: Event) => void) | null = null;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onerror: ((ev: Event) => void) | null = null;
  private listeners: Record<string, EventListener[]> = {};

  constructor(url: string) {
    this.url = url;
  }
  addEventListener(type: string, listener: EventListener) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
  }
  removeEventListener(type: string, listener: EventListener) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
  }
  dispatchEvent(_event: Event) {
    return true;
  }
  close = vi.fn();
}

Object.defineProperty(globalThis, 'EventSource', {
  value: MockEventSource,
  writable: true,
});
