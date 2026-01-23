import { Sequelize } from 'sequelize';
import { config } from '../config/database.config';
import Logger from './logger';

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.storage,
    logging: false,
});

// Database wrapper class
class Database {
    private static instance: Database;

    public static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(url?: string) {
        try {
            Logger.log().info('Connecting to SQLite via Sequelize...');
            await sequelize.authenticate();
            Logger.log().info('Connected to SQLite.');
            return sequelize;
        } catch (error) {
            console.error('Error connecting to database:', error);
            throw error;
        }
    }

    public getConnection() {
        return sequelize;
    }
}

// Export both the sequelize instance (default) and the Database class
export default sequelize;
export { Database };
