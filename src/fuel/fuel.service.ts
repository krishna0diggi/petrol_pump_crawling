import { Injectable } from '@nestjs/common';
import { FuelRepository } from './fuel.repository';
import { FuelStationEntity } from './fuel-station.entity';
import { FuelType } from './fuel.type';

@Injectable()
export class FuelService {
  constructor(private readonly repo: FuelRepository) {}

  async save(place: any, fuelType: FuelType) {
    const station = new FuelStationEntity();
    station.eloc = place.eLoc;
    station.name = place.placeName;
    station.brand = fuelType;
    station.latitude = place.latitude;
    station.longitude = place.longitude;
    station.geom = `SRID=4326;POINT(${place.longitude} ${place.latitude})`;
    station.address = place.placeAddress;
    // station.postalCode = place.

    return this.repo.save(station);
  }
}
