import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('geo_grid')
export class Grid{
    @PrimaryColumn()
    id:string; // IND_12.95_77.55

    @Column('double precision')
    centerLat:number;

    @Column("double precision")
    centerLng:number;

    @Column({default:3000})
    radiusM:number;

    @Column({nullable:true})
    petrolCheckedAt: Date;

    @Column({nullable:true})
    dieselCheckedAt:Date;

    @Column({nullable:true})
    EvCheckedAt:Date;

    @Column({nullable:true})
    CngCheckedAt:Date;

    @Column({nullable:true})
    createdAt:Date;

    @Column({nullable:true})
    updatedAt:Date;
}