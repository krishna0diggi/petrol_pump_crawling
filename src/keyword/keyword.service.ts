import { Injectable } from '@nestjs/common';
import brands from '../../src/keyword/fuel-brands.json';
import { FuelType } from 'src/fuel/fuel.type';

@Injectable()
export class KeywordService {
  getKeywords(type: FuelType): string[] {
    return (brands as Record<FuelType, string[]>)[type] || [];
  }
}
