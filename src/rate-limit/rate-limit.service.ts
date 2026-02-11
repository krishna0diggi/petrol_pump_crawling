import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);
  private lastCall = 0;
  private readonly delayMs = 1000;

  async wait(): Promise<void> {
    const now = Date.now();
    const diff = now - this.lastCall;

    if (diff < this.delayMs) {
      const waitTime = this.delayMs - diff;
      this.logger.debug(`Rate limit: Pausing for ${waitTime}ms`);
      await new Promise(res =>
        setTimeout(res, waitTime),
      );
    }

    this.lastCall = Date.now();
  }
}
