import { Module } from '@nestjs/common';
import { CrawlTaskEntity } from './crawl-task.entity';
import { GridModule } from 'src/grid/grid.module';
import { KeywordModule } from 'src/keyword/keyword.module';
import { MapmyindiaModule } from 'src/mapmyindia/mapmyindia.module';
import { RateLimitModule } from 'src/rate-limit/rate-limit.module';
import { DedupModule } from 'src/dedup/dedup.module';
import { FuelModule } from 'src/fuel/fuel.module';
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
export class CrawlModule {}
