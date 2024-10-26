import { Response } from 'express';

type Cache = {
  prevCategory: string;
  orders: { [clientId: string]: Response };
};

export const cache: Cache = {
  orders: {},
  prevCategory: '',
};
