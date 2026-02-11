import { Module } from '@nestjs/common';
import { GridService } from './grid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grid } from './grid.entity';
import { GridRepository } from './grid.repository';
import { GridSeed } from './grid.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Grid])],
  providers: [GridRepository,GridService, GridSeed],
  exports: [GridRepository]
})
export class GridModule { }
