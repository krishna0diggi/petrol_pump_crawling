import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Grid } from "./grid.entity";
import { FuelType } from "../fuel/fuel.type";

export class GridRepository {
    private readonly logger = new Logger(GridRepository.name);
    constructor(
        @InjectRepository(Grid)
        private readonly repo: Repository<Grid>,
    ) { }

    async count(): Promise<number> {
        return this.repo.count();
    }

    async findAll(): Promise<Grid[]> {
        return this.repo.find();
    }

    async findById(id: string): Promise<Grid | null> {
        return this.repo.findOne({ where: { id } })
    }
    async save(grid: Grid): Promise<Grid> {
        return this.repo.save(grid)
    }
    async bulkInsert(grids: Grid[]): Promise<void> {
        const chunkSize = 5000;
        this.logger.log(`Starting bulk insert of ${grids.length} grids in chunks of ${chunkSize}...`);

        for (let i = 0; i < grids.length; i += chunkSize) {
            const chunk = grids.slice(i, i + chunkSize);
            await this.repo
                .createQueryBuilder()
                .insert()
                .values(chunk)
                .orIgnore()
                .execute();

            this.logger.log(`Inserted chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(grids.length / chunkSize)}`);
        }
    }

    async markChecked(gridId: string, fuelType: FuelType): Promise<void> {
        // const field = fuelType === 'petrol' ? 'petrolCheckedAt' :
        //               fuelType === 'diesel' ? 'dieselCheckedAt' :
        //               fuelType === 'isEv' ? 'isEvCheckedAt' :
        //               'isCngCheckedAt';
        const field = fuelType === FuelType.PETROL ? 'petrolCheckedAt' :
            fuelType === FuelType.DIESEL ? 'dieselCheckedAt' :
                fuelType === FuelType.EV ? 'evCheckedAt' :
                    'cngCheckedAt';
        await this.repo
            .createQueryBuilder()
            .update(Grid)
            .set({ [field]: new Date() })
            .where("id = :id", { id: gridId })
            .execute();
    }
}