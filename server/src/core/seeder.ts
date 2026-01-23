import { Database } from './database';
import Logger from './logger';
import { Sequelize, ModelStatic, Model } from 'sequelize';

interface SeederInstance {
    up?: () => Promise<void>;
    down?: () => Promise<void>;
}

type SeederRecord = {
    seeder: { new (): SeederInstance };
    action: 'up' | 'down';
};

class Seeder {
    private static instance: Seeder;
    private seeders: SeederRecord[] = [];
    private sequelize: Sequelize | null = null;

    public static getInstance() {
        if (!Seeder.instance) {
            Seeder.instance = new Seeder();
        }
        return Seeder.instance;
    }

    public async run(): Promise<void> {
        if (process.env.NODE_ENV !== 'development') {
            Logger.log().info(`========= Database seeder run only in DEVELOPMENT ENVIRONMENT =========`);
            return;
        }

        Logger.log().info(`========= START DATABASE SEEDER =========`);
        this.sequelize = await Database.getInstance().connect();

        for (const row of this.seeders) {
            const { seeder, action } = row;
            const seederClass = new seeder();

            if (action === 'up') {
                if (seederClass.up && typeof seederClass.up === 'function') {
                    await seederClass.up();
                }
            } else {
                if (seederClass.down && typeof seederClass.down === 'function') {
                    await seederClass.down();
                }
            }
        }

        Logger.log().info(`========= END DATABASE SEEDER =========`);
    }

    public async call(SeederClass: { new (): SeederInstance }, action: 'up' | 'down' = 'up'): Promise<void> {
        this.seeders.push({
            seeder: SeederClass,
            action: action,
        });
    }

    public async insertData(Model: ModelStatic<Model>, data: unknown[]) {
        try {
            Logger.log().info(`====> inserting data into ${Model.tableName}`);
            await Model.bulkCreate(data as any[]);
            Logger.log().info(`====> inserted data into ${Model.tableName}`);
        } catch (error: unknown) {
            const message = (error as Error).message || String(error);
            Logger.log().error(`Failed to insert data into ${Model.tableName}.`, message);
        }
    }

    public async deleteData(Model: ModelStatic<Model>) {
        try {
            Logger.log().info(`====> deleting data from ${Model.tableName}`);
            await Model.destroy({ where: {}, truncate: true });
            Logger.log().info(`====> deleted data from ${Model.tableName}`);
        } catch (error: unknown) {
            const message = (error as Error).message || String(error);
            Logger.log().error(`Failed to delete data from ${Model.tableName}.`, message);
        }
    }
}
export default Seeder.getInstance();
