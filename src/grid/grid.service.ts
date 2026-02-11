import { Injectable } from '@nestjs/common';
import { Grid } from './grid.entity';

@Injectable()
export class GridService {
    // India bounding box (WGS84)
    private readonly MIN_LAT = 6.5;
    private readonly MAX_LAT = 37.5;
    private readonly MIN_LNG = 68.0;
    private readonly MAX_LNG = 97.5;

    private readonly STEP_DEG = 0.045;

    generateIndiaGrid(): Grid[] {
    const grids: Grid[] = [];

    for (
      let lat = this.MIN_LAT;
      lat <= this.MAX_LAT;
      lat += this.STEP_DEG
    ) {
      for (
        let lng = this.MIN_LNG;
        lng <= this.MAX_LNG;
        lng += this.STEP_DEG
      ) {
        const latFixed = Number(lat.toFixed(3));
        const lngFixed = Number(lng.toFixed(3));

        const grid = new Grid();
        grid.id = `IND_${latFixed}_${lngFixed}`;
        grid.centerLat = latFixed;
        grid.centerLng = lngFixed;
        grid.radiusM = 3000;
        // grid.petrolCheckedAt = null;
        // grid.dieselCheckedAt = null;
        // grid.isCngCheckedAt = null;
        // grid.evCheckedAt = null;
        // grid.updatedAt = null;
        // grid.createdAt = new Date();

        grids.push(grid);
      }
    }

    return grids;
  }


}
