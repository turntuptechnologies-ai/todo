import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /api/health', () => {
  it('ステータス 200 と ok レスポンスを返す', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('timestamp が ISO 8601 形式である', async () => {
    const res = await request(app).get('/api/health');

    const timestamp = res.body.timestamp as string;
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });
});
