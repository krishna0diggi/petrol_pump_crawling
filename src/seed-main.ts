import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GridSeed } from './grid/grid.seed';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('Seeder');
    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        const seeder = app.get(GridSeed);
        await seeder.seedOnce();
        logger.log('Seeding completed');
    } catch (error) {
        logger.error('Seeding failed', error);
    } finally {
        await app.close();
    }
}

bootstrap();
