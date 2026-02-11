import { Injectable, Logger } from '@nestjs/common';
import { GridService } from './grid.service';
import { GridRepository } from './grid.repository';

@Injectable()
export class GridSeed {
  private readonly logger = new Logger(GridSeed.name);

  constructor(
    private readonly gridService: GridService,
    private readonly gridRepo: GridRepository,
  ) {}

  async seedOnce(): Promise<void> {
    const existingCount = await this.gridRepo.count();

    if (existingCount > 0) {
      this.logger.log(
        `Grid already seeded (${existingCount} records). Skipping.`,
      );
      return;
    }

    this.logger.log('Generating PAN-India grid...');
    const grids = this.gridService.generateIndiaGrid();

    this.logger.log(`Inserting ${grids.length} grid cells...`);
    await this.gridRepo.bulkInsert(grids);

    this.logger.log('Grid seeding completed successfully.');
  }
}
