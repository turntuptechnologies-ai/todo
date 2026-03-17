import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/index.js';
import type { ApiError } from '@todo/shared';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    const body: ApiError = {
      error: {
        message: err.message,
        code: err.code,
      },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  console.error('予期しないエラー:', err);

  const body: ApiError = {
    error: {
      message: 'サーバー内部エラーが発生しました',
    },
  };
  res.status(500).json(body);
};
