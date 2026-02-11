import { Injectable, Logger } from '@nestjs/common';
import { CrawlTaskRepository } from './crawl-task.repository';
import { GridRepository } from '../grid/grid.repository';
import { KeywordService } from '../keyword/keyword.service';
import { MapmyIndiaTextSearchClient } from '../mapmyindia/textsearch.client';
import { RateLimitService } from '../rate-limit/rate-limit.service';
import { DedupService } from '../dedup/dedup.service';
import { FuelService } from '../fuel/fuel.service';

@Injectable()
export class CrawlExecutorService {
  private readonly logger = new Logger(CrawlExecutorService.name);

  constructor(
    private readonly taskRepo: CrawlTaskRepository,
    private readonly gridRepo: GridRepository,
    private readonly keywordService: KeywordService,
    private readonly textSearch: MapmyIndiaTextSearchClient,
    private readonly rateLimit: RateLimitService,
    private readonly dedupService: DedupService,
    private readonly fuelService: FuelService,
  ) { }

  /**
   * Executes ONE crawl task safely.
   * Called repeatedly by scheduler.
   */
  async executeOnce(): Promise<void> {
    const task = await this.taskRepo.nextPending();
    if (!task) {
      this.logger.debug('No pending crawl tasks');
      return;
    }

    this.logger.log(`Starting execution for task ${task.id} (Grid=${task.gridId}, Fuel=${task.fuelType})`);
    await this.taskRepo.markRunning(task);

    try {
      const grid = await this.gridRepo.findById(task.gridId);
      if (!grid) {
        throw new Error(`Grid not found: ${task.gridId}`);
      }

      const keywords = this.keywordService.getKeywords(task.fuelType);
      this.logger.log(`Keywords for ${task.fuelType}: ${keywords.join(', ')}`);

      for (const keyword of keywords) {
        let page = 1;

        while (true) {
          await this.rateLimit.wait();

          this.logger.log(
            `Searching [${task.fuelType}] "${keyword}" at Lat=${grid.centerLat}, Lng=${grid.centerLng} (Page ${page})`,
          );

          const response = await this.textSearch.search({
            query: keyword,
            lat: grid.centerLat,
            lng: grid.centerLng,
            radius: grid.radiusM,
            page,
          });

          const locations = response.data?.suggestedLocations || [];
          this.logger.log(`Keyword "${keyword}" Page ${page} found ${locations.length} locations`);

          if (locations.length === 0) {
            break; // pagination exhausted
          }

          let savedCount = 0;
          let skippedCount = 0;

          for (const place of locations) {
            const exists = await this.dedupService.exists(place);
            if (exists) {
              skippedCount++;
              continue;
            }

            await this.fuelService.save(place, task.fuelType);
            savedCount++;
          }

          this.logger.log(`Keyword "${keyword}" Page ${page}: Saved ${savedCount}, Skipped (deduped) ${skippedCount}`);

          page += 1;
        }
      }

      // mark grid as checked
      await this.gridRepo.markChecked(task.gridId, task.fuelType);

      await this.taskRepo.markDone(task);
      this.logger.log(`Crawl completed: ${task.id}`);
    } catch (err) {
      this.logger.error(
        `Crawl failed: ${task.id}`,
        err?.stack || err,
      );
      await this.taskRepo.markFailed(task, err.message);
    }
  }
}
