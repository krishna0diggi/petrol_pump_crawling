import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DedupService {
  private readonly logger = new Logger(DedupService.name);
  constructor(private readonly dataSource: DataSource) { }

  async exists(place: any): Promise<boolean> {
    if (place.eLoc) {
      const res = await this.dataSource.query(
        `SELECT 1 FROM fuel_station WHERE eloc = $1 LIMIT 1`,
        [place.eLoc],
      );
      if (res.length) {
        this.logger.debug(`Skip: eLoc match (${place.eLoc}) for "${place.placeName}"`);
        return true;
      }
    }

    if (place.latitude && place.longitude) {
      const res = await this.dataSource.query(
        `
        SELECT 1 FROM fuel_station
        WHERE ST_DWithin(
          geom,
          ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,
          10
        )
        LIMIT 1
        `,
        [place.longitude, place.latitude],
      );
      if (res.length > 0) {
        this.logger.debug(`Skip: Spatial proximity match for "${place.placeName}" at ${place.latitude},${place.longitude}`);
        return true;
      }
    }

    return false;
  }
}
