import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import Logger from './core/logger';
import { Database } from './core/database';
import { config as DB_CONFIG } from './config/database.config';
import initDb from './database/init.database';
import WebSocketService from './services/websocket.service';
dotenv.config();

const port: string = process.env.PORT || '3000';
const base_url: string = process.env.BASE_URL || 'http://127.0.0.1';
const version: string = process.env.VERSION || 'v1';
let database: any = null;

const server = http.createServer(app);

// initialize Socket.IO (replaces previous WebSocket implementation)
WebSocketService.init(server);

server.listen(parseInt(port), async () => {
    database = await Database.getInstance().connect(DB_CONFIG.url);
    await initDb();
    // log server start
    Logger.log().info(`LISTENING ON ${base_url}:${port}/api/${version}`);
});

//  Shutdown helper
async function shutdown(signal?: string, err?: any) {
    try {
        if (signal) {
            Logger.log().info(`Received ${signal} - shutting down`);
        } else {
            Logger.log().info('Shutting down server');
        }

        if (err) {
            Logger.log().error('Shutdown due to error:', err);
        }

        if (database && typeof database.close === 'function') {
            try {
                await database.close();
                Logger.log().info('Database connection closed');
            } catch (closeErr) {
                Logger.log().error('Error closing database connection:', closeErr);
            }
        }
    } catch (e) {
        Logger.log().error('Error during shutdown:', e);
    } finally {
        // ensure process exits
        process.exit(err ? 1 : 0);
    }
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

process.on('uncaughtException', (error) => {
    Logger.log().error('Uncaught Exception:', error);
    void shutdown('uncaughtException', error);
});

process.on('unhandledRejection', (reason) => {
    Logger.log().error('Unhandled Rejection:', reason);
});

process.on('exit', (code) => {
    Logger.log().info(`Process exit event with code: ${code}`);
});
