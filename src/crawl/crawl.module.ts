import { Module } from '@nestjs/common';
import { CrawlTaskEntity } from './crawl-task.entity';
import { GridModule } from '../grid/grid.module';
import { KeywordModule } from '../keyword/keyword.module';
import { MapmyindiaModule } from '../mapmyindia/mapmyindia.module';
import { RateLimitModule } from '../rate-limit/rate-limit.module';
import { DedupModule } from '../dedup/dedup.module';
import { FuelModule } from '../fuel/fuel.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlTaskRepository } from './crawl-task.repository';
import { CrawlPlannerService } from './crawl-planner.service';
import { CrawlExecutorService } from './crawl-executor.service';
import { CrawlScheduler } from './crawl.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrawlTaskEntity]),
    GridModule,
    KeywordModule,
    MapmyindiaModule,
    RateLimitModule,
    DedupModule,
    FuelModule,
  ],
  providers: [
    CrawlTaskRepository,
    CrawlPlannerService,
    CrawlExecutorService,
    CrawlScheduler
  ],
})
export class CrawlModule { }
