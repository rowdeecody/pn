import Database from './database';
import Logger from './logger';

class Migration {
    private static instance: Migration;
    private migrations: any[] = [];
    private sequelize: any = null;

    public static getInstance() {
        if (!Migration.instance) {
            Migration.instance = new Migration();
        }
        return Migration.instance;
    }

    public async call(MigrationClass: any, action: 'up' | 'down' = 'up'): Promise<void> {
        this.migrations.push({
            migration: MigrationClass,
            action: action,
        });
    }

    public async run() {
        if (process.env.NODE_ENV !== 'development') {
            Logger.log().info(`========= Database migration run only in DEVELOPMENT ENVIRONMENT =========`);
            return;
        }

        console.error(`========= START DATABASE MIGRATION =========`);
        this.sequelize = await Database.connect();

        for (const row of this.migrations) {
            const { migration, action } = row;
            const migrationClass = new migration();

            if (action === 'up') {
                if (migrationClass.up && typeof migrationClass.up === 'function') {
                    await migrationClass.up();
                }
            } else {
                if (migrationClass.down && typeof migrationClass.down === 'function') {
                    await migrationClass.down();
                }
            }
        }

        console.error(`========= END DATABASE MIGRATION =========`);
    }

    public async createTable(Model: any) {
        try {
            Logger.log().info(`====> creating table ${Model.tableName}`);
            await Model.sync({ force: false });
            Logger.log().info(`====> created/synced table ${Model.tableName}`);
        } catch (error: any) {
            Logger.log().error(`Failed to sync table ${Model.tableName}.`, error.message);
        }
    }

    public async dropTable(Model: any) {
        try {
            Logger.log().info(`====> dropping table ${Model.tableName}`);
            await Model.drop();
            Logger.log().info(`====> dropped table ${Model.tableName}`);
        } catch (error: any) {
            Logger.log().error(`Failed to drop table ${Model.tableName}.`, error.message);
        }
    }
}
export default Migration.getInstance();
