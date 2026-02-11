import { Injectable } from '@nestjs/common';
import { GridRepository } from '../grid/grid.repository';
import { CrawlTaskRepository } from './crawl-task.repository';
import { FuelType } from 'src/fuel/fuel.type';

@Injectable()
export class CrawlPlannerService {
  constructor(
    private readonly gridRepo: GridRepository,
    private readonly taskRepo: CrawlTaskRepository,
  ) {}

  async plan(): Promise<void> {
    const grids = await this.gridRepo.findAll();

    for (const grid of grids) {
      if (!grid.petrolCheckedAt) {
        await this.taskRepo.createIfMissing(grid.id, FuelType.PETROL);
      }

      if (!grid.EvCheckedAt) {
        await this.taskRepo.createIfMissing(grid.id, FuelType.EV);
      }

      if (!grid.CngCheckedAt) {
        await this.taskRepo.createIfMissing(grid.id, FuelType.CNG);
      }

      if (!grid.dieselCheckedAt) {
        await this.taskRepo.createIfMissing(grid.id, FuelType.DIESEL);
      }
    }
  }
}
