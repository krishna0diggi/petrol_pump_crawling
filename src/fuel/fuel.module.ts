import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelStationEntity } from './fuel-station.entity';
import { FuelService } from './fuel.service';
import { FuelRepository } from './fuel.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FuelStationEntity])],
  providers: [FuelService, FuelRepository],
  exports: [FuelService],
})
export class FuelModule {}
