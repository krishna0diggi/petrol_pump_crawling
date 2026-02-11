import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelStationEntity } from './fuel-station.entity';

@Injectable()
export class FuelRepository {
  constructor(
    @InjectRepository(FuelStationEntity)
    private readonly repo: Repository<FuelStationEntity>,
  ) {}

  save(station: FuelStationEntity) {
    return this.repo.save(station);
  }
}
