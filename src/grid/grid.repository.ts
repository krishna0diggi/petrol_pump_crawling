import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Grid } from "./grid.entity";
import { FuelType } from "src/fuel/fuel.type";

export class GridRepository {
    constructor(
        @InjectRepository(Grid)
        private readonly repo: Repository<Grid>,
    ) { }

    async count(): Promise<number> {
        return this.repo.count();
    }

    async findAll(): Promise<Grid[]>{
        return this.repo.find();
    }

    async findById(id:string): Promise<Grid|null>{
        return this.repo.findOne({where:{id}})
    }
    async save (grid:Grid):Promise<Grid>{
        return this.repo.save(grid)
    }
    async bulkInsert(grids:Grid[]): Promise<void>{
        await this.repo
        .createQueryBuilder()
        .insert()
        .values(grids)
        .orIgnore()
        .execute()
    }

    async markeChecked(gridId:string, fuelType:FuelType):Promise<void>{
        // const field = fuelType === 'petrol' ? 'petrolCheckedAt' :
        //               fuelType === 'diesel' ? 'dieselCheckedAt' :
        //               fuelType === 'isEv' ? 'isEvCheckedAt' :
        //               'isCngCheckedAt';
        const field = fuelType === FuelType.PETROL ? 'petrolCheckedAt' :
                      fuelType === FuelType.DIESEL ? 'dieselCheckedAt' :
                      fuelType === FuelType.EV ? 'EvCheckedAt' :
                      'CngCheckedAt';
        await this.repo
        .createQueryBuilder()
        .update(Grid)
        .set({[field]: new Date()})
        .where("id = :id", {id:gridId})
        .execute();
    }
}