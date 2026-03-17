import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { asyncHandler } from '../lib/async-handler.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';
import type { ApiResponse, Category } from '@todo/shared';

const router = Router();

router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    const body: ApiResponse<Category[]> = { data: categories as unknown as Category[] };
    res.json(body);
  }),
);

router.post(
  '/categories',
  asyncHandler(async (req, res) => {
    const { name, color } = req.body;
    if (!name || typeof name !== 'string') {
      throw new BadRequestError('カテゴリ名は必須です');
    }
    const category = await prisma.category.create({
      data: {
        name,
        color: color ?? undefined,
      },
    });
    const body: ApiResponse<Category> = { data: category as unknown as Category };
    res.status(201).json(body);
  }),
);

router.patch(
  '/categories/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const { name, color } = req.body;
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('カテゴリが見つかりません');
    }
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
      },
    });
    const body: ApiResponse<Category> = { data: category as unknown as Category };
    res.json(body);
  }),
);

router.delete(
  '/categories/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('カテゴリが見つかりません');
    }
    await prisma.category.delete({ where: { id } });
    res.status(204).end();
  }),
);

export default router;
