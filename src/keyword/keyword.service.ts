import { Injectable, Logger } from '@nestjs/common';
import brands from '../../src/keyword/fuel-brands.json';
import { FuelType } from "../fuel/fuel.type";

@Injectable()
export class KeywordService {
  private readonly logger = new Logger(KeywordService.name);
  getKeywords(type: FuelType): string[] {
    const list = (brands as Record<FuelType, string[]>)[type] || [];
    this.logger.debug(`Providing ${list.length} keywords for ${type}`);
    return list;
  }
}
