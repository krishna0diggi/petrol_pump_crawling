import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('fuel_station')
@Index(['eloc'], { unique: true })
export class FuelStationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    eloc: string;

    @Column()
    name: string;

    @Column()
    brand: string;

    @Column('double precision')
    latitude: number;

    @Column('double precision')
    longitude: number;

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    geom: {
        type: string;
        coordinates: number[];
    };

    @Column()
    address: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    postalCode: string;
}
