import { Injectable, Logger } from '@nestjs/common';
import { FuelRepository } from './fuel.repository';
import { FuelStationEntity } from './fuel-station.entity';
import { FuelType } from './fuel.type';

@Injectable()
export class FuelService {
  private readonly logger = new Logger(FuelService.name);
  constructor(private readonly repo: FuelRepository) { }

  async save(place: any, fuelType: FuelType) {
    const brand = this.identifyBrand(place.placeName, fuelType);
    this.logger.log(`Saving new ${fuelType} station: "${place.placeName}"(Brand: ${brand})`);

    const station = new FuelStationEntity();
    station.eloc = place.eLoc;
    station.name = place.placeName;
    station.brand = brand;
    station.latitude = place.latitude;
    station.longitude = place.longitude;
    station.geom = {
      type: 'Point',
      coordinates: [place.longitude, place.latitude],
    };
    station.address = place.placeAddress;

    // Simple address parsing
    const addressParts = place.placeAddress?.split(',').map(s => s.trim()) || [];
    if (addressParts.length >= 3) {
      station.postalCode = addressParts.find(p => /^\d{6}$/.test(p)) || null;
      station.state = addressParts[addressParts.length - 1];
      station.city = addressParts[addressParts.length - 2];
    }

    return this.repo.save(station);
  }

  private identifyBrand(name: string, type: FuelType): string {
    const n = name.toUpperCase();
    if (n.includes('INDIAN OIL') || n.includes('IOCL')) return 'Indian Oil';
    if (n.includes('HP') || n.includes('HINDUSTAN PETROLEUM')) return 'HP';
    if (n.includes('BHARAT PETROLEUM') || n.includes('BPCL')) return 'Bharat Petroleum';
    if (n.includes('SHELL')) return 'Shell';
    if (n.includes('RELIANCE') || n.includes('JIO BP')) return 'Jio BP';
    if (n.includes('NAYARA') || n.includes('ESSAR')) return 'Nayara';
    return type; // fallback to fuel type
  }
}
