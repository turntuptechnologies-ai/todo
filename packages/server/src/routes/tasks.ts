import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { asyncHandler } from '../lib/async-handler.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';
import { sseManager } from './sse.js';
import type { ApiResponse, Task } from '@todo/shared';

const router = Router();

router.get(
  '/tasks',
  asyncHandler(async (_req, res) => {
    const tasks = await prisma.task.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    const body: ApiResponse<Task[]> = { data: tasks as unknown as Task[] };
    res.json(body);
  }),
);

router.get(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const task = await prisma.task.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!task) {
      throw new NotFoundError('タスクが見つかりません');
    }
    const body: ApiResponse<Task> = { data: task as unknown as Task };
    res.json(body);
  }),
);

router.post(
  '/tasks',
  asyncHandler(async (req, res) => {
    const { title, description, priority, dueDate, categoryId } = req.body;
    if (!title || typeof title !== 'string') {
      throw new BadRequestError('タイトルは必須です');
    }
    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? undefined,
        priority: priority ?? undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        categoryId: categoryId ?? undefined,
      },
      include: { category: true },
    });
    sseManager.broadcast('task:created', { task });
    const body: ApiResponse<Task> = { data: task as unknown as Task };
    res.status(201).json(body);
  }),
);

router.patch(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const { title, description, completed, priority, dueDate, categoryId } = req.body;
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('タスクが見つかりません');
    }
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: { category: true },
    });
    sseManager.broadcast('task:updated', { task });
    const body: ApiResponse<Task> = { data: task as unknown as Task };
    res.json(body);
  }),
);

router.delete(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('タスクが見つかりません');
    }
    await prisma.task.delete({ where: { id } });
    sseManager.broadcast('task:deleted', { id });
    res.status(204).end();
  }),
);

export default router;
