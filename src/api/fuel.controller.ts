import { Controller, Get, Query } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('fuel-stations')
export class FuelController {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * PUBLIC API
   * Client → Your DB
   */
  @Get()
  async nearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius = 5000,
  ) {
    return this.dataSource.query(
      `
      SELECT
        id,
        name,
        brand,
        latitude,
        longitude,
        address
      FROM fuel_station
      WHERE ST_DWithin(
        geom,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      ORDER BY
        ST_Distance(
          geom,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        )
      `,
      [lng, lat, radius],
    );
  }
}
