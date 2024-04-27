import { Injectable } from '@nestjs/common';

@Injectable()
export class PlaneUtility {
  constructor() {}

  paginationFunc(batch: number, limit: number): number {
    try {
      const theBatch = batch ?? 1;
      const theLimit = limit ?? 10;
      return Math.max(0, +(theBatch - 1) * theLimit);
    } catch (error) {
      throw error;
    }
  }
}
