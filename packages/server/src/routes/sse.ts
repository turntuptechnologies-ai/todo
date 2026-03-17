import { Router } from 'express';
import type { Response } from 'express';

const HEARTBEAT_INTERVAL = 30_000;

class SSEManager {
  private clients = new Set<Response>();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  addClient(res: Response): void {
    this.clients.add(res);
    if (this.clients.size === 1) {
      this.startHeartbeat();
    }
  }

  removeClient(res: Response): void {
    this.clients.delete(res);
    if (this.clients.size === 0) {
      this.stopHeartbeat();
    }
  }

  broadcast(event: string, data: unknown): void {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients) {
      client.write(message);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.broadcast('heartbeat', { timestamp: new Date().toISOString() });
    }, HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

export const sseManager = new SSEManager();

const router = Router();

router.get('/sse/tasks', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  sseManager.addClient(res);

  const connectMessage = `event: connected\ndata: ${JSON.stringify({ message: '接続しました' })}\n\n`;
  res.write(connectMessage);

  req.on('close', () => {
    sseManager.removeClient(res);
  });
});

export default router;
