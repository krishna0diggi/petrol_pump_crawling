import { Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CrawlPlannerService } from "./crawl-planner.service";
import { CrawlExecutorService } from "./crawl-executor.service";

export class CrawlScheduler {
    private readonly logger = new Logger(CrawlScheduler.name);

    constructor(
        private readonly planner: CrawlPlannerService,
        private readonly executor: CrawlExecutorService,
    ) { }
    @Cron('0 * * * *') // Every hour
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