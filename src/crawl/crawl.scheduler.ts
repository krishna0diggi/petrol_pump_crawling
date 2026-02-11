import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CrawlPlannerService } from "./crawl-planner.service";
import { CrawlExecutorService } from "./crawl-executor.service";

@Injectable()
export class CrawlScheduler implements OnModuleInit {
    private readonly logger = new Logger(CrawlScheduler.name);

    constructor(
        private readonly planner: CrawlPlannerService,
        private readonly executor: CrawlExecutorService,
    ) { }

    async onModuleInit() {
        this.logger.log('System started: Auto-triggering initial plan and crawl...');
        try {
            this.logger.log('--- Phase 1: Planning ---');
            await this.planTasks();

            this.logger.log('--- Phase 2: First Execution ---');
            await this.run();

            this.logger.log('Startup flow completed successfully.');
        } catch (err) {
            this.logger.error('Startup flow failed', err.stack || err);
        }
    }
    @Cron('0 3 * * *') // 3 AM daily
    async planTasks() {
        this.logger.log('Planning crawl tasks');
        await this.planner.plan();
    }

    @Cron('*/5 * * * *') // every 5 minutes
    async run() {
        this.logger.log('Executing crawl task');
        await this.executor.executeOnce();
    }
}