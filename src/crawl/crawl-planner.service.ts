import { Injectable, Logger } from '@nestjs/common';
import { GridRepository } from '../grid/grid.repository';
import { CrawlTaskRepository } from './crawl-task.repository';
import { FuelType } from "../fuel/fuel.type";

@Injectable()
export class CrawlPlannerService {
  private readonly logger = new Logger(CrawlPlannerService.name);

  constructor(
    private readonly gridRepo: GridRepository,
    private readonly taskRepo: CrawlTaskRepository,
  ) { }

  async plan(): Promise<void> {
    const gridCount = await this.gridRepo.count();

    if (gridCount === 0) {
      this.logger.warn('No grids found in database! Please run grid seeding first: npm run seed:grid');
      return;
    }

    this.logger.log(`Planning tasks for ${gridCount} grids...`);

    const fuelTypes = [FuelType.PETROL, FuelType.EV, FuelType.CNG, FuelType.DIESEL];

    for (const fuelType of fuelTypes) {
      this.logger.log(`Checking for new ${fuelType} tasks...`);
      const added = await this.taskRepo.bulkCreateTasksFromGrids(fuelType);
      if (added > 0) {
        this.logger.log(`Added ${added} new tasks for ${fuelType}`);
      }
    }

    this.logger.log(`Planning complete.`);
  }
}
