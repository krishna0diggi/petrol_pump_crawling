import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitService {
  private lastCall = 0;
  private readonly delayMs = 1000;

  async wait(): Promise<void> {
    const now = Date.now();
    const diff = now - this.lastCall;

    if (diff < this.delayMs) {
      await new Promise(res =>
        setTimeout(res, this.delayMs - diff),
      );
    }

    this.lastCall = Date.now();
  }
}
