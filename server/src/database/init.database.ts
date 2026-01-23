import sequelize from '../core/database';
import Logger from '../core/logger';
import { initModels } from '../models';

async function syncDatabase(syncOptions?: { force?: boolean; alter?: boolean }) {
    await sequelize.authenticate();
    Logger.log().info('Connected to Sequelize DB');
    await sequelize.sync(syncOptions || {});
    Logger.log().info('Database synchronized');
}

type InitDbOptions = {
    syncOptions?: { force?: boolean; alter?: boolean };
    adminConfig?: { username: string; password: string; name?: string; email?: string; role?: string };
    settings?: Array<{ key: string; value: string; type: string }>;
};

/**
 * Initializes DB: defines associations, syncs models, and seeds defaults inside a transaction.
 * - options.adminConfig.password should be provided (or fallback to process.env).
 */
const InitDatabase = async (options: InitDbOptions = {}) => {
    // Initialize models and their associations
    initModels();

    try {
        await syncDatabase(options.syncOptions);
        Logger.log().info('DB initialization complete');
    } catch (err) {
        console.error('DB Init Error:', err);
        throw err;
    }
};

export default InitDatabase;
