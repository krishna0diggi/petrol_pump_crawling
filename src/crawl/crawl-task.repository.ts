import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrawlTaskEntity } from './crawl-task.entity';
import { FuelType } from "../fuel/fuel.type";

@Injectable()
export class CrawlTaskRepository {
  constructor(
    @InjectRepository(CrawlTaskEntity)
    private readonly repo: Repository<CrawlTaskEntity>,
  ) { }

  async createIfMissing(gridId: string, fuelType: FuelType): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .values({ gridId, fuelType })
      .orIgnore()
      .execute();
  }

  async nextPending(): Promise<CrawlTaskEntity | null> {
    return this.repo.createQueryBuilder('task')
      .where("task.status = 'PENDING'")
      .orWhere("task.status = 'FAILED' AND task.attempts < 3")
      .orderBy("task.createdAt", "ASC")
      .getOne();
  }

  async markRunning(task: CrawlTaskEntity): Promise<void> {
    task.status = 'RUNNING';
    task.attempts += 1;
    await this.repo.save(task);
  }

  async markDone(task: CrawlTaskEntity): Promise<void> {
    task.status = 'DONE';
    await this.repo.save(task);
  }

  async markFailed(task: CrawlTaskEntity, error: string): Promise<void> {
    task.status = 'FAILED';
    task.lastError = error;
    await this.repo.save(task);
  }

  async bulkCreateTasksFromGrids(fuelType: FuelType): Promise<number> {
    const checkField = fuelType === FuelType.PETROL ? 'petrolCheckedAt' :
      fuelType === FuelType.DIESEL ? 'dieselCheckedAt' :
        fuelType === FuelType.EV ? 'evCheckedAt' :
          'cngCheckedAt';

    const result = await this.repo.query(`
      INSERT INTO crawl_task ("gridId", "fuelType", "status")
      SELECT id, $1, 'PENDING'
      FROM geo_grid
      WHERE "${checkField}" IS NULL
      ON CONFLICT ("gridId", "fuelType") DO NOTHING
    `, [fuelType]);

    return parseInt(result[1]) || 0; // Return count from Postgres result
  }
}
