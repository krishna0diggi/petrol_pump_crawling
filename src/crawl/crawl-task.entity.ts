import { FuelType } from 'src/fuel/fuel.type';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// export type FuelType = 'PETROL' | 'EV' | 'CNG' | 'DIESEL';
export type CrawlStatus = 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED';

// fuel.types.ts



@Entity('crawl_task')
@Unique(['gridId', 'fuelType'])
export class CrawlTaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  gridId: string;

  @Column({ type: 'varchar', length: 10 })
  fuelType: FuelType;

  @Column({ type: 'varchar', length: 10, default: 'PENDING' })
  status: CrawlStatus;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'text', nullable: true })
  lastError: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
