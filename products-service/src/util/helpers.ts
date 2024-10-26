import { Response } from 'express';
import { cache } from './cache';

export const setupSSE = (res: Response, clientId: string) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.on('close', () => {
    delete cache.orders[clientId];
    res.end();
  });
};
