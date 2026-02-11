import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrawlTaskEntity } from './crawl-task.entity';
import { FuelType } from 'src/fuel/fuel.type';

@Injectable()
export class CrawlTaskRepository {
  constructor(
    @InjectRepository(CrawlTaskEntity)
    private readonly repo: Repository<CrawlTaskEntity>,
  ) {}

  async createIfMissing(gridId: string, fuelType: FuelType): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .values({ gridId, fuelType })
      .orIgnore()
      .execute();
  }

  async nextPending(): Promise<CrawlTaskEntity | null> {
    return this.repo.findOne({
      where: { status: 'PENDING' },
      order: { createdAt: 'ASC' },
    });
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
}
