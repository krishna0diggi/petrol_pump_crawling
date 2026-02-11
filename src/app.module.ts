import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './config/database.config';
import { GridModule } from './grid/grid.module';
import { KeywordModule } from './keyword/keyword.module';
import { CrawlerModule } from './crawler/crawler.module';
import { MapmyindiaModule } from './mapmyindia/mapmyindia.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { DedupModule } from './dedup/dedup.module';
import { FuelModule } from './fuel/fuel.module';
import { CrawlModule } from './crawl/crawl.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    GridModule,
    KeywordModule,
    CrawlerModule,
    MapmyindiaModule,
    RateLimitModule,
    DedupModule,
    FuelModule,
    CrawlModule,
    ApiModule,
  ],
  providers: [],
})
export class AppModule {}
